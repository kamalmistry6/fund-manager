import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = environment.apiBaseUrl;
  private authStatusSubject = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient) {}

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login`, credentials).pipe(
      tap((res: any) => {
        this.storeToken(res.token);
        this.storeRole(res.role);
        this.authStatusSubject.next(true);
      })
    );
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getUserRole() {
    const token = this.getToken();
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role;
    }
    return null;
  }

  getUserId(): number {
    const token = this.getToken();
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.userId;
    }
    throw new Error('User not authenticated.');
  }

  // TOKEN & ROLE STORAGE
  private storeToken(token: string): void {
    localStorage.setItem('token', token);
  }

  private storeRole(role: string): void {
    localStorage.setItem('role', role);
  }
  private hasToken(): boolean {
    return !!this.getToken();
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  }
}
