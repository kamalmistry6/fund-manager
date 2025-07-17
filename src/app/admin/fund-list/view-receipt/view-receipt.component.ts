import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fund } from '../../models/funds';
import html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-view-receipt',
  standalone: false,
  templateUrl: './view-receipt.component.html',
  styleUrl: './view-receipt.component.scss',
})
export class ViewReceiptComponent {
  receiptData: fund;
  constructor(
    private dialogRef: MatDialogRef<ViewReceiptComponent>,
    @Inject(MAT_DIALOG_DATA) public data: fund
  ) {
    this.receiptData = data;
  }

  printReceipt(): void {
    const printContent = document.getElementById('receipt-wrapper');
    if (!printContent) {
      console.error('Receipt content not found for printing.');
      return;
    }

    // Hide all content except receipt for print
    const originalContents = document.body.innerHTML;
    const receiptHTML = printContent.outerHTML;

    document.body.innerHTML = receiptHTML;
    window.print();
    document.body.innerHTML = originalContents;
    location.reload();
  }

  downloadReceipt(): void {
    const element = document.getElementById('receipt-wrapper');
    if (!element) {
      console.error('Receipt content not found.');
      return;
    }

    const opt = {
      margin: [5, 5, 5, 5],
      filename: `Receipt-${this.data.receipt_no}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all'] },
    };

    html2pdf().set(opt).from(element).save();
  }

  convertNumberToWords(num: number): string {
    const ones = [
      '',
      'One',
      'Two',
      'Three',
      'Four',
      'Five',
      'Six',
      'Seven',
      'Eight',
      'Nine',
      'Ten',
      'Eleven',
      'Twelve',
      'Thirteen',
      'Fourteen',
      'Fifteen',
      'Sixteen',
      'Seventeen',
      'Eighteen',
      'Nineteen',
    ];
    const tens = [
      '',
      '',
      'Twenty',
      'Thirty',
      'Forty',
      'Fifty',
      'Sixty',
      'Seventy',
      'Eighty',
      'Ninety',
    ];

    if (num === 0) return 'Zero';

    if (num < 20) return ones[num];

    if (num < 100)
      return (
        tens[Math.floor(num / 10)] + (num % 10 ? ' ' + ones[num % 10] : '')
      );

    if (num < 1000)
      return (
        ones[Math.floor(num / 100)] +
        ' Hundred' +
        (num % 100 ? ' ' + this.convertNumberToWords(num % 100) : '')
      );

    if (num < 100000)
      return (
        this.convertNumberToWords(Math.floor(num / 1000)) +
        ' Thousand' +
        (num % 1000 ? ' ' + this.convertNumberToWords(num % 1000) : '')
      );

    if (num < 10000000)
      return (
        this.convertNumberToWords(Math.floor(num / 100000)) +
        ' Lakh' +
        (num % 100000 ? ' ' + this.convertNumberToWords(num % 100000) : '')
      );

    return (
      this.convertNumberToWords(Math.floor(num / 10000000)) +
      ' Crore' +
      (num % 10000000 ? ' ' + this.convertNumberToWords(num % 10000000) : '')
    );
  }

  convertAmountToWords(amount: number): string {
    const integerPart = Math.floor(amount);
    const decimalPart = Math.round((amount - integerPart) * 100);

    let words = this.convertNumberToWords(integerPart) + ' Rupees';

    if (decimalPart > 0) {
      words += ' and ' + this.convertNumberToWords(decimalPart) + ' Paise';
    }

    return words + ' Only';
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
