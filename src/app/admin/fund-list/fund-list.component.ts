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

@Component({
  selector: 'app-fund-list',
  standalone: false,
  templateUrl: './fund-list.component.html',
  styleUrl: './fund-list.component.scss',
})
export class FundListComponent implements OnInit {
  showMasterBulding = false;
  currentYear = '2526';
  lastReceiptNo: number = 0;

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
    'bulding',
    'mode_of_payment',
    'date',
    'amount',
    'action',
  ];
  fundDataSource = new MatTableDataSource<fund>();

  fundForm!: FormGroup;
  filterForm!: FormGroup;

  isSubmitting = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private fundService: FundService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private toastService: ToastService
  ) {
    this.initializeForm();
    this.initializeFilterForm();
    this.syncBuildingSelection();
  }

  ngOnInit(): void {
    this.getFunds();

    // filter call
    this.filterForm.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(() => {
        this.getFunds();
      });
  }

  toggleMasterBulding() {
    this.showMasterBulding = !this.showMasterBulding;
  }

  initializeForm(): void {
    const today = formatDate(new Date(), 'yyyy-MM-dd', 'en');

    this.fundForm = this.fb.group({
      receipt_no: ['', Validators.required],
      name: ['', Validators.required],
      bulding: ['', Validators.required],
      mode_of_payment: ['cash', Validators.required],
      year: ['22', Validators.required],
      date: [today, Validators.required],
      amount: [
        '',
        [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)],
      ],
    });
  }

  initializeFilterForm(): void {
    this.filterForm = this.fb.group({
      receipt_no: [''],
      name: [''],
      // date: [''],
      // mode_of_payment: [''],
    });
  }
  resetFilters() {
    this.filterForm.reset();
    this.getFunds();
  }

  onBuildingSelected(): void {
    this.toggleMasterBulding();
  }

  syncBuildingSelection(): void {
    const savedBuilding = localStorage.getItem('selectedBuilding');
    if (savedBuilding) {
      this.buildingControl.setValue(savedBuilding);
      this.fundForm.patchValue({ bulding: savedBuilding });
    }

    // Subscribe to changes and update form + localStorage
    this.buildingControl.valueChanges.subscribe((selectedBuilding) => {
      this.fundForm.patchValue({ bulding: selectedBuilding });
      localStorage.setItem('selectedBuilding', selectedBuilding || '');
    });
  }

  getFunds(): void {
    const filters = this.filterForm.value;

    this.fundService.getFunds(filters).subscribe(
      (data: fund[]) => {
        this.fundDataSource = new MatTableDataSource(data);
        this.fundDataSource.paginator = this.paginator;
        this.fundDataSource.data = data;
        this.updateLastReceiptNo(data);
        this.generateReceiptNo();
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching allotment data:', error);
      }
    );
  }

  downlaodExcel(): void {
    this.fundService.downloadExcel().subscribe(
      (response) => {
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
      (error) => {
        console.error('Error downloading excel file:', error);
      }
    );
  }

  updateLastReceiptNo(funds: fund[]): void {
    let maxReceiptNo = 0;

    funds.forEach((fund) => {
      const receiptStr = fund.receipt_no.split('/')[0];

      const receiptNumber = parseInt(receiptStr, 10);
      if (!isNaN(receiptNumber) && receiptNumber > maxReceiptNo) {
        maxReceiptNo = receiptNumber;
      }
    });

    this.lastReceiptNo = maxReceiptNo;
    console.log('Latest Receipt No found:', this.lastReceiptNo);
  }

  generateReceiptNo(): void {
    this.lastReceiptNo++;

    const formattedNumber = this.lastReceiptNo.toString().padStart(3, '0');
    const receiptNo = `${formattedNumber}/${this.currentYear}`;

    this.fundForm.controls['receipt_no'].setValue(receiptNo);

    console.log('Receipt No set:', receiptNo);
  }

  onSubmit() {
    if (this.fundForm.invalid) {
      this.toastService.showToast(
        'Please fill all required fields correctly.',
        'error'
      );
      return;
    }

    this.isSubmitting = true;
    const fundData = this.fundForm.value;

    this.fundService.addFund(fundData).subscribe({
      next: (response) => {
        this.toastService.showToast(
          'Fund Record added successfully!',
          'success'
        );
        this.getFunds();

        const currentBuilding = this.buildingControl.value;

        this.fundForm.reset({
          mode_of_payment: 'cash',
          date: formatDate(new Date(), 'yyyy-MM-dd', 'en'),
          year: '22',
          bulding: currentBuilding,
        });
        this.isSubmitting = false;
      },
      error: (error) => {
        this.toastService.showToast('Error adding fund.', 'error');
        console.error('Fund add error:', error);
        this.isSubmitting = false;
      },
    });
  }

  deleteFund(id: number) {
    if (confirm('Are you sure you want to delete this fund record?')) {
      this.fundService.deleteFund(id).subscribe(
        () => {
          this.toastService.showToast(
            'Fund record deleted successfully!',
            'success'
          );
          this.getFunds(); // refresh the list after deletion
        },
        (error) => {
          console.error('Error deleting fund:', error);
          this.toastService.showToast('Error deleting fund record.', 'error');
        }
      );
    }
  }
}
