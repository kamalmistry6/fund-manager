import { Component, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AllotExpensesService } from '../Services/allotfund.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastService } from '../../services/toast.service';
import { MatTableDataSource } from '@angular/material/table';
import { userExpenses } from '../../user/model/userExpenses';
import { MatPaginator } from '@angular/material/paginator';
import { Allotment } from '../models/expenses';

@Component({
  selector: 'app-allot-expenses',
  standalone: false,
  templateUrl: './allot-expenses.component.html',
  styleUrl: './allot-expenses.component.scss',
})
export class AllotExpensesComponent {
  allotForm!: FormGroup;
  selectedUserId: number | null = null;
  userName: string = '';

  users: Allotment[] = [];
  isSubmitting = false;

  userTotalAmount: number = 0;

  displayedColumns: string[] = [
    'sr_no',
    'title',
    'spent_on',
    'amount',
    // 'action',
  ];
  userExpenseDataSource = new MatTableDataSource<userExpenses>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private allotExpensesService: AllotExpensesService,
    private fb: FormBuilder,
    private toastService: ToastService
  ) {
    this.users;
    this.allotForm = this.fb.group({
      userId: [''],
      amount: [''],
    });
  }

  ngOnInit(): void {
    this.loadUserNames();
  }
  getUserData(user: Allotment) {
    this.selectedUserId = user.id;
    this.userName = user.name;

    this.getUserExpenses(user.id);
  }

  loadUserNames(): void {
    this.allotExpensesService.getUserNames().subscribe({
      next: (data: Allotment[]) => {
        this.users = data;
        if (this.users.length > 0) {
          this.userName = this.users[0].name;
          this.selectedUserId = this.users[0].id;
          this.getUserExpenses(this.selectedUserId);
        }
      },
      error: (err) => {
        console.error('Error fetching user names:', err);
      },
    });
  }

  getUserExpenses(userId: number): void {
    this.allotExpensesService.getUserExpenses(userId).subscribe({
      next: (data: userExpenses[]) => {
        this.userExpenseDataSource.data = data;
        this.userExpenseDataSource.paginator = this.paginator;

        this.userTotalAmount = data.reduce(
          (sum, item) => sum + Number(item.amount),
          0
        );
      },
      error: (error) => {
        console.error('Error fetching user expenses:', error);
      },
    });
  }

  onSubmit() {
    if (this.allotForm.invalid) {
      this.toastService.showToast(
        'Please fill all required fields correctly.',
        'error'
      );
      return;
    }

    this.isSubmitting = true;
    const allotData = this.allotForm.value;

    this.allotExpensesService.addAllotExpenses(allotData).subscribe({
      next: (response) => {
        this.toastService.showToast('Amount Alloted successfully!', 'success');
        this.allotForm.reset();
        this.isSubmitting = false;
      },
      error: (error) => {
        this.toastService.showToast('Error Alloting Amount.', 'error');
        this.isSubmitting = false;
      },
    });
  }
}
