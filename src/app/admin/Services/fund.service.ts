import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { fund } from '../models/funds';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class FundService {
  // private baseUrl = 'http://localhost:5000/';
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  getFunds(filters: fund): Observable<any> {
    let params = new HttpParams();

    if (filters.receipt_no) {
      params = params.set('receipt_no', filters.receipt_no);
    }
    if (filters.name) {
      params = params.set('name', filters.name);
    }
    if (filters.date) {
      params = params.set('date', filters.date);
    }
    if (filters.mode_of_payment) {
      params = params.set('mode_of_payment', filters.mode_of_payment);
    }
    if (filters.marked_as_pay_later) {
      params = params.set('marked_as_pay_later', filters.marked_as_pay_later);
    }
    if (filters.building) {
      params = params.set('building', filters.building);
    }

    return this.http.get(`${this.baseUrl}/funds`, { params });
  }
  downloadExcel(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/funds/download-excel`, {
      responseType: 'blob', // <-- important to get file as blob
    });
  }

  addFund(fundData: fund): Observable<any> {
    return this.http.post(`${this.baseUrl}/funds`, fundData);
  }

  deleteFund(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/funds/${id}`);
  }
}
