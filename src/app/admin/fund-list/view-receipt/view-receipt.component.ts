import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fund } from '../../models/funds';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
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

  numberToWords(num: number): string {
    if (num === 0) return 'Zero Only';

    const a = [
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
    const b = [
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

    const numberToWordsHelper = (n: number): string => {
      if (n < 20) return a[n];
      if (n < 100)
        return b[Math.floor(n / 10)] + (n % 10 ? ' ' + a[n % 10] : '');
      if (n < 1000)
        return (
          a[Math.floor(n / 100)] +
          ' Hundred' +
          (n % 100 ? ' ' + numberToWordsHelper(n % 100) : '')
        );
      if (n < 100000)
        return (
          numberToWordsHelper(Math.floor(n / 1000)) +
          ' Thousand' +
          (n % 1000 ? ' ' + numberToWordsHelper(n % 1000) : '')
        );
      if (n < 10000000)
        return (
          numberToWordsHelper(Math.floor(n / 100000)) +
          ' Lakh' +
          (n % 100000 ? ' ' + numberToWordsHelper(n % 100000) : '')
        );
      return (
        numberToWordsHelper(Math.floor(n / 10000000)) +
        ' Crore' +
        (n % 10000000 ? ' ' + numberToWordsHelper(n % 10000000) : '')
      );
    };

    return numberToWordsHelper(num);
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
