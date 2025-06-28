import { Component } from '@angular/core';
import { PermissionService } from '../../services/permission.service';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  isPopupOpen = false;

  constructor(public permissionService: PermissionService) {}

  togglePopup() {
    this.isPopupOpen = !this.isPopupOpen;
  }
}
