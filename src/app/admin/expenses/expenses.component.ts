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
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-expenses',
  standalone: false,
  templateUrl: './expenses.component.html',
  styleUrl: './expenses.component.scss',
})
export class ExpensesComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

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

  statusTypeOptions: string[] = ['Paid', 'Pending'];
  paymentMethodOptions: string[] = ['Cash', 'Card', 'Online'];

  dataSource = new MatTableDataSource<expenses>();
  previewImageUrl: SafeUrl | null = null;
  private imageBaseUrl = `${environment.apiBaseUrl.replace(
    '/api',
    ''
  )}/uploads/expenses/`;

  constructor(
    private expensesService: ExpensesService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.getExpenses();
  }

  getExpenses(): void {
    this.expensesService.getExpenses().subscribe({
      next: (data: expenses[]) => {
        data.forEach((item) => {
          item['statusClass'] =
            item.status?.toLowerCase() === 'paid'
              ? 'status-paid'
              : 'status-pending';
        });

        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error fetching expenses data:', error);
        alert('Failed to load expenses. Please try again.');
      },
    });
  }

  viewBillPhoto(fileName: string): void {
    const url = `${this.imageBaseUrl}${fileName}`;

    const headers = new HttpHeaders({
      'ngrok-skip-browser-warning': 'true',
    });

    this.http.get(url, { headers, responseType: 'blob' }).subscribe({
      next: (blob) => {
        this.previewImageUrl = this.sanitizer.bypassSecurityTrustUrl(
          URL.createObjectURL(blob)
        );
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Image load failed:', err);
        alert('Failed to load image. Try again.');
      },
    });
  }

  closeImagePreview(): void {
    this.previewImageUrl = null;
    this.cdr.markForCheck();
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

  deleteExpense(id: number): void {
    if (confirm('Are you sure you want to delete this expense?')) {
      this.expensesService.deleteExpense(id).subscribe({
        next: () => {
          this.getExpenses();
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