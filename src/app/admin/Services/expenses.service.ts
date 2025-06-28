import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { expenses } from '../models/expenses';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ExpensesService {
  // private baseUrl = 'http://localhost:5000/';
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  getExpenses(filters: any): Observable<expenses[]> {
    let params = new HttpParams();

    if (filters.name) {
      params = params.set('name', filters.name);
    }
    if (filters.payment_method) {
      params = params.set('payment_method', filters.payment_method);
    }
    if (filters.expense_date) {
      params = params.set('expense_date', filters.expense_date);
    }
    if (filters.status) {
      params = params.set('status', filters.status);
    }

    return this.http.get<expenses[]>(`${this.baseUrl}/expenses`, { params });
  }

  addExpense(expensesData: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/expenses/`, expensesData);
  }
  deleteExpense(id: number): Observable<expenses> {
    return this.http.delete<expenses>(`${this.baseUrl}/expenses/${id}`);
  }
}
