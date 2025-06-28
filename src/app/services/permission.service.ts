import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class PermissionService {
  constructor(private authService: AuthService) {}

  hasPermission(requiredRole: string): boolean {
    const currentRole = this.authService.getRole();
    console.log(`Current role: ${currentRole}`);
    return currentRole === requiredRole;
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  hasAnyRole(...roles: string[]): boolean {
    const currentRole = this.authService.getRole();
    return roles.includes(currentRole || '');
  }

  isAdmin(): boolean {
    return this.authService.getRole() === 'admin';
  }

  isUser(): boolean {
    return this.authService.getRole() === 'user';
  }
}
