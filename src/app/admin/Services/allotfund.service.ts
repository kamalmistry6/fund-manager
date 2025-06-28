import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { userExpenses } from '../../user/model/userExpenses';
import { Allotment } from '../models/expenses';

@Injectable({
  providedIn: 'root',
})
export class AllotExpensesService {
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient, private authService: AuthService) {}

  getUserNames(): Observable<Allotment[]> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<Allotment[]>(`${this.baseUrl}/auth/users/names`, {
      headers,
    });
  }

  getUserExpenses(id: number): Observable<userExpenses[]> {
    return this.http.get<userExpenses[]>(`${this.baseUrl}/user-expenses/${id}`);
  }

  addAllotExpenses(allotData: { id: string; amount: number }): Observable<any> {
    return this.http.post(`${this.baseUrl}/allot`, allotData);
  }
}
