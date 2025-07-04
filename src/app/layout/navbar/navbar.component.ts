import { Component } from '@angular/core';
import { PermissionService } from '../../services/permission.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  isPopupOpen = false;

  constructor(
    public permissionService: PermissionService,
    private authService: AuthService,
    private router: Router
  ) {}

  togglePopup() {
    this.isPopupOpen = !this.isPopupOpen;
  }
  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
