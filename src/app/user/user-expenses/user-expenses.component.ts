import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserExpesesService } from '../service/user-expeses.service';
import { ToastService } from '../../services/toast.service';
import { AuthService } from '../../services/auth.service';
import { userExpenses } from '../model/userExpenses';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-user-expenses',
  standalone: false,
  templateUrl: './user-expenses.component.html',
  styleUrl: './user-expenses.component.scss',
})
export class UserExpensesComponent {
  userExpensesForm!: FormGroup;

  isSubmitting = false;
  userId: number;
  expenses: userExpenses[] = [];
  totalAmount: number = 0;
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
    private fb: FormBuilder,
    private userExpesesService: UserExpesesService,
    private toastService: ToastService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {
    this.userId = this.authService.getUserId();

    this.initializeForm();
  }
  ngOnInit(): void {
    if (this.userId) {
      this.getUserExpenses(this.userId);
      this.getAvaliableBalance(this.userId);
    }
  }

  initializeForm(): void {
    this.userExpensesForm = this.fb.group({
      userId: [this.userId],
      title: ['', Validators.required],
      amount: ['', Validators.required],
    });
  }

  getUserExpenses(userId: number): void {
    this.userExpesesService.getUserExpenses(userId).subscribe({
      next: (data) => {
        this.userExpenseDataSource = new MatTableDataSource(data);
        this.userExpenseDataSource.paginator = this.paginator;
        this.userExpenseDataSource.data = data;
        this.cdr.detectChanges();

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

  getAvaliableBalance(userId: number): void {
    this.userExpesesService.getAvaliableBalance(userId).subscribe({
      next: (responses) => {
        this.totalAmount = responses.totalExpenses;
      },
      error: (err) => {
        console.error('Error fetching available balance:', err);
      },
    });
  }

  onSubmit() {
    if (this.userExpensesForm.invalid) {
      this.userExpensesForm.markAllAsTouched();
      return;
    }
    const userExpensesData = this.userExpensesForm.value;

    this.userExpesesService.addUserExpense(userExpensesData).subscribe({
      next: (response) => {
        this.userExpensesForm.reset({
          userId: this.userId,
          title: '',
          amount: '',
        });
        this.toastService.showToast('Expenses added successfully!', 'success');
        this.getUserExpenses(this.userId);

        this.isSubmitting = false;
      },
      error: (error) => {
        console.log(error.error);

        this.toastService.showToast(
          error.error?.error || 'Something went wrong'
        );
        this.isSubmitting = false;
      },
    });
  }

  deleteFund(id: number) {
    if (confirm('Are you sure you want to delete this Expenses record?')) {
      this.userExpesesService.deleteUserExpense(id).subscribe(
        () => {
          this.toastService.showToast(
            'Expenses deleted successfully!',
            'success'
          );
        },
        (error) => {
          this.toastService.showToast(
            'Error deleting expenses record.',
            'error'
          );
        }
      );
    }
  }
}
