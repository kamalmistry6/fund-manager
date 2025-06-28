import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { userExpenses } from '../model/userExpenses';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserExpesesService {
  private baseUrl = environment.apiBaseUrl;
  constructor(private http: HttpClient) {}

  getUserExpenses(id: number): Observable<userExpenses[]> {
    return this.http.get<userExpenses[]>(`${this.baseUrl}/user-expenses/${id}`);
  }

  getAvaliableBalance(id: number): Observable<{ totalExpenses: number }> {
    return this.http.get<{ totalExpenses: number }>(
      `${this.baseUrl}/user-expenses/total-amount/${id}`
    );
  }

  addUserExpense(userExpensesData: userExpenses): Observable<userExpenses> {
    return this.http.post<userExpenses>(
      `${this.baseUrl}/user-expenses/`,
      userExpensesData
    );
  }

  deleteUserExpense(id: number): Observable<userExpenses> {
    return this.http.delete<userExpenses>(
      `${this.baseUrl}/user-expenses/${id}`
    );
  }
}
