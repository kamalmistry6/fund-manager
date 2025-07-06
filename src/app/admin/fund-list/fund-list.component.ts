import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { formatDate } from '@angular/common';
import { ToastService } from '../../services/toast.service';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { FundService } from '../Services/fund.service';
import { fund } from '../models/funds';
import { ViewReceiptComponent } from './view-receipt/view-receipt.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-fund-list',
  standalone: false,
  templateUrl: './fund-list.component.html',
  styleUrl: './fund-list.component.scss',
})
export class FundListComponent implements OnInit {
  currentYear = '2526';
  lastReceiptNo = 0;
  showMasterBulding = false;
  isSubmitting = false;

  buildingControl = new FormControl('');
  flatTypeOptions: string[] = [
    'Sneha Apt',
    'Samrat Apt',
    'Kalpataru Heights',
    'Kalpataru Residency',
    'Swati Apt',
    'Devdarshan Apt',
    'Sai Kiran Apt',
    'Kaladeep Apt',
    'Vijaydeep Apt',
    'Nilraj Park Apt',
    'Mangaldeep Apt',
    'Srihari Apt',
    'Vrushabh Apt',
    'Golden Chariot Apt',
    'Shivam Bungalow',
  ];

  displayedColumns: string[] = [
    'sr_no',
    'receipt_no',
    'name',
    'building',
    'mode_of_payment',
    'date',
    'marked_as_pay_later',
    'amount',
    'action',
  ];

  fundDataSource = new MatTableDataSource<fund>();

  fundForm!: FormGroup;
  filterForm!: FormGroup;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private fundService: FundService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private toastService: ToastService,
    private dialog: MatDialog
  ) {
    this.initializeForm();
    this.initializeFilterForm();
    this.syncBuildingSelection();
  }

  ngOnInit(): void {
    this.getFunds();
    this.handlePayLaterChanges();

    this.filterForm.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(() => this.getFunds());
  }

  initializeForm(): void {
    const today = formatDate(new Date(), 'yyyy-MM-dd', 'en');

    this.fundForm = this.fb.group({
      receipt_no: [''],
      name: ['', Validators.required],
      building: ['', Validators.required],
      mode_of_payment: ['cash', Validators.required],
      year: ['22', Validators.required],
      date: [today, Validators.required],
      amount: [
        '',
        [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)],
      ],
      marked_as_pay_later: ['paid'],
    });
  }

  initializeFilterForm(): void {
    this.filterForm = this.fb.group({
      receipt_no: [''],
      name: [''],
      // date: [''],
      // mode_of_payment: [''],
      marked_as_pay_later: [''],
    });
  }

  openDialog(element: fund): void {
    const dialogRef = this.dialog.open(ViewReceiptComponent, {
      width: '90vw',
      maxWidth: '600px',
      maxHeight: '90vh',
      panelClass: 'custom-dialog-container',
      data: element,
    });
  }

  handlePayLaterChanges(): void {
    const payLaterCtrl = this.fundForm.get('marked_as_pay_later');
    const receiptCtrl = this.fundForm.get('receipt_no');
    const paymentCtrl = this.fundForm.get('mode_of_payment');
    const amountCtrl = this.fundForm.get('amount');

    if (!payLaterCtrl) return;

    payLaterCtrl.valueChanges.subscribe((status) => {
      if (status === 'pending') {
        receiptCtrl?.setValue('');
        receiptCtrl?.clearValidators();
        paymentCtrl?.clearValidators();
        amountCtrl?.clearValidators();

        paymentCtrl?.disable();
        amountCtrl?.disable();
      } else {
        this.generateReceiptNo();

        receiptCtrl?.setValidators(Validators.required);
        paymentCtrl?.setValidators(Validators.required);
        amountCtrl?.setValidators([
          Validators.required,
          Validators.pattern(/^\d+(\.\d{1,2})?$/),
        ]);

        paymentCtrl?.enable();
        amountCtrl?.enable();
      }

      receiptCtrl?.updateValueAndValidity();
      paymentCtrl?.updateValueAndValidity();
      amountCtrl?.updateValueAndValidity();
    });
  }

  syncBuildingSelection(): void {
    const savedBuilding = localStorage.getItem('selectedBuilding');
    if (savedBuilding) {
      this.buildingControl.setValue(savedBuilding);
      this.fundForm.patchValue({ building: savedBuilding });
    }

    this.buildingControl.valueChanges.subscribe((selected) => {
      this.fundForm.patchValue({ building: selected });
      localStorage.setItem('selectedBuilding', selected || '');
    });
  }

  getFunds(): void {
    const filters = this.filterForm.value;

    this.fundService.getFunds(filters).subscribe({
      next: (data: fund[]) => {
        this.fundDataSource = new MatTableDataSource(data);
        this.fundDataSource.paginator = this.paginator;
        this.fundDataSource.data = data;
        this.updateLastReceiptNo(data);

        if (this.fundForm.get('marked_as_pay_later')?.value === 'paid') {
          this.generateReceiptNo();
        }

        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error fetching funds:', err),
    });
  }

  updateLastReceiptNo(funds: fund[]): void {
    let maxReceiptNo = 0;

    funds.forEach((fund) => {
      if (fund.marked_as_pay_later !== 'pending' && fund.receipt_no) {
        const [receiptStr] = fund.receipt_no.split('/');
        const num = parseInt(receiptStr, 10);
        if (!isNaN(num) && num > maxReceiptNo) maxReceiptNo = num;
      }
    });

    this.lastReceiptNo = maxReceiptNo;
  }

  generateReceiptNo(): void {
    this.lastReceiptNo++;
    const formatted = this.lastReceiptNo.toString().padStart(3, '0');
    const newReceipt = `${formatted}/${this.currentYear}`;
    this.fundForm.get('receipt_no')?.setValue(newReceipt);
  }

  onSubmit(): void {
    if (this.fundForm.invalid) {
      this.toastService.showToast('Please fill all required fields.', 'error');
      return;
    }

    this.isSubmitting = true;
    const fundData = this.fundForm.value;

    if (fundData.marked_as_pay_later === 'pending') {
      fundData.mode_of_payment = null;
      fundData.amount = null;
      fundData.receipt_no = null;
    }

    this.fundService.addFund(fundData).subscribe({
      next: () => {
        this.toastService.showToast('Fund added successfully!', 'success');
        this.getFunds();

        const selectedBuilding = this.buildingControl.value;
        this.fundForm.reset({
          mode_of_payment: 'cash',
          date: formatDate(new Date(), 'yyyy-MM-dd', 'en'),
          year: '22',
          building: selectedBuilding,
          marked_as_pay_later: 'paid',
        });

        this.isSubmitting = false;
      },
      error: (err) => {
        this.toastService.showToast('Error adding fund.', 'error');
        console.error(err);
        this.isSubmitting = false;
      },
    });
  }

  deleteFund(id: number): void {
    if (confirm('Are you sure you want to delete this fund record?')) {
      this.fundService.deleteFund(id).subscribe({
        next: () => {
          this.toastService.showToast('Fund deleted successfully.', 'success');
          this.getFunds();
        },
        error: (err) => {
          console.error(err);
          this.toastService.showToast('Error deleting fund.', 'error');
        },
      });
    }
  }

  downloadExcel(): void {
    this.fundService.downloadExcel().subscribe({
      next: (response) => {
        const blob = new Blob([response], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `fund-records-${Date.now()}.xlsx`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => console.error('Error downloading Excel:', err),
    });
  }

  toggleMasterBulding(): void {
    this.showMasterBulding = !this.showMasterBulding;
  }

  resetFilters(): void {
    this.filterForm.reset();
    this.getFunds();
  }
}
