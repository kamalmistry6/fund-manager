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
  //   const token = localStorage.getItem('token'); // or sessionStorage, or via your AuthService

  //   if (token) {
  //     return true;
  //   } else {
  //     // Not logged in, redirect to login page
  //     this.router.navigate(['/auth/login']);
  //     return false;
  //   }
  // }

  const token = localStorage.getItem('token');
    const role = localStorage.getItem('role'); // optional, if you store role

    // Case 1: No token → send to login
    if (!token) {
      this.router.navigate(['/auth/login']);
      return false;
    }
        // Case 2: Already logged in and trying to go to login page → redirect to dashboard
    if (state.url.includes('/auth/login')) {
      if (role === 'admin') {
        this.router.navigate(['/admin/dashboard']);
      } else {
        this.router.navigate(['/user/user-expenses']);
      }
      return false;
    }

    // Case 3: Authenticated → allow access
    return true;
  }

}
