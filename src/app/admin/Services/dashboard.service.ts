import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ExpensesDashboardStats } from '../models/ExpensesDashboardStats';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  getDashboardStats(): Observable<ExpensesDashboardStats> {
    return this.http.get<ExpensesDashboardStats>(`${this.baseUrl}/stats`);
  }
}
