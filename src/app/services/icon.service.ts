import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class IconService {
  private iconsRegistered = false;
  constructor(
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer
  ) {}

  registerIcons() {
    if (this.iconsRegistered) {
      return;
    }

    this.iconRegistry.addSvgIcon(
      'menu',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/menu.svg')
    );
    this.iconRegistry.addSvgIcon(
      'save',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/save.svg')
    );
    this.iconRegistry.addSvgIcon(
      'delete',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/delete.svg')
    );
    this.iconRegistry.addSvgIcon(
      'edit',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/edit.svg')
    );
    this.iconRegistry.addSvgIcon(
      'close',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/close.svg')
    );

    this.iconRegistry.addSvgIcon(
      'add',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/plus.svg')
    );
    this.iconRegistry.addSvgIcon(
      'building',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/building.svg')
    );

    this.iconsRegistered = true;
  }
}
