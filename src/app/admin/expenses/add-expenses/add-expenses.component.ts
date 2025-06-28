import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { formatDate } from '@angular/common';
import { ExpensesService } from '../../Services/expenses.service';

@Component({
  selector: 'app-add-expenses',
  standalone: false,
  templateUrl: './add-expenses.component.html',
  styleUrl: './add-expenses.component.scss',
})
export class AddExpensesComponent {
  @Output() dataChanged = new EventEmitter<void>();
  expensesForm!: FormGroup;
  statusTypeOptions: string[] = ['Paid', 'Pending'];
  paymentMethodOptions: string[] = ['Cash', 'Card', 'Online'];

  constructor(
    private dialogRef: MatDialogRef<AddExpensesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private expensesService: ExpensesService
  ) {
    this.initializeForm();
  }

  initializeForm(): void {
    const today = formatDate(new Date(), 'yyyy-MM-dd', 'en');

    this.expensesForm = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      description: ['', Validators.required],
      expense_date: [today, Validators.required],
      payment_method: ['', Validators.required],
      status: ['Paid', Validators.required],
      amount: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.expensesForm.invalid) {
      alert('Please fill all required fields correctly.');
      return;
    }

    const expensesData = this.expensesForm.value;

    if (expensesData.expense_date) {
      expensesData.expense_date = this.formatDate(expensesData.expense_date);
    }

    this.addExpense(expensesData);
  }

  addExpense(expensesData: any): void {
    this.expensesService.addExpense(expensesData).subscribe(
      () => {
        this.dataChanged.emit(); // ✅ Emit event when added
        this.dialogRef.close(true);
      },
      (error) => {
        console.error('Error adding expense:', error);
      }
    );
  }

  formatDate(isoDate: string): string {
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
