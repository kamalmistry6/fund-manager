import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { AddExpensesComponent } from './add-expenses/add-expenses.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { expenses } from '../models/expenses';
import { ExpensesService } from '../Services/expenses.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-expenses',
  standalone: false,
  templateUrl: './expenses.component.html',
  styleUrl: './expenses.component.scss',
})
export class ExpensesComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  expensesFilterForm!: FormGroup;
  statusTypeOptions: string[] = ['Paid', 'Pending'];
  paymentMethodOptions: string[] = ['Cash', 'Card', 'Online'];
  displayedColumns: string[] = [
    'sr_no',
    'name',
    'expense_date',
    'description',
    'payment_method',
    'status',
    'amount',
    'bill_photo',
    'action',
  ];
  dataSource = new MatTableDataSource<expenses>();
  expensesData: expenses[] = [];
  previewImageUrl: string | null = null;

  constructor(
    private expensesService: ExpensesService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder
  ) {
    this.initializeFilterForm();
  }

  ngOnInit(): void {
    this.getExpenses();

    this.expensesFilterForm.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => {
        this.getExpenses();
      });
  }

  initializeFilterForm(): void {
    this.expensesFilterForm = this.fb.group({
      name: [''],
      expense_date: [''],
      payment_method: [''],
      status: [''],
    });
  }
  resetFilters() {
    this.expensesFilterForm.reset();
    this.getExpenses();
  }
  viewBillPhoto(fileName: string): void {
    this.previewImageUrl = `${environment.apiBaseUrl.replace(
      '/api',
      ''
    )}/uploads/expenses/${fileName}`;
  }

  closeImagePreview(): void {
    this.previewImageUrl = null;
  }

  getStatusClass(status: string): string {
    return status.toLowerCase() === 'paid' ? 'status-paid' : 'status-pending';
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AddExpensesComponent, {
      width: '90vw',
      maxWidth: '600px',
      maxHeight: '90vh',
      panelClass: 'custom-dialog-container',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getExpenses();
      }
    });
  }

  getExpenses(): void {
    const filters = this.expensesFilterForm.value;

    this.expensesService.getExpenses(filters).subscribe(
      (data: expenses[]) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.data = data;
        this.expensesData = data;
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching expenses data:', error);
        alert('Failed to load expenses. Please try again.');
      }
    );
  }

  deleteExpense(id: number): void {
    if (confirm('Are you sure you want to delete this expense?')) {
      this.expensesService.deleteExpense(id).subscribe({
        next: () => {
          this.getExpenses(); // 🔥 Refresh table after deleting
          alert('Expense deleted successfully.');
        },
        error: (err) => {
          console.error('Error deleting expense:', err);
          alert('Failed to delete expense. Please try again.');
        },
      });
    }
  }
}
