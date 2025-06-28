import { Component } from '@angular/core';
import { IconService } from './services/icon.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'fund-manager';
  constructor(private iconService: IconService) {
    this.iconService.registerIcons();
  }
}
