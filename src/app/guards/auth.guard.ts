import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const token = localStorage.getItem('token'); // or sessionStorage, or via your AuthService

    if (token) {
      return true;
    } else {
      // Not logged in, redirect to login page
      this.router.navigate(['/auth/login']);
      return false;
    }
  }
}
