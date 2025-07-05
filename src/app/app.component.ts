import { Component, HostListener } from '@angular/core';
import { IconService } from './services/icon.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'fund-manager';
  deferredPrompt: any;
  showInstallButton = false;
  hideTimeout: any;
  constructor(private iconService: IconService) {
    this.iconService.registerIcons();
  }

  ngOnInit(): void {
    // Check localStorage for maybeLater timestamp
    const maybeLaterTime = localStorage.getItem('maybeLaterTime');
    if (maybeLaterTime) {
      const diff = Date.now() - parseInt(maybeLaterTime, 10);
      if (diff < 20 * 60 * 1000) {
        // within 20 mins, don't show popup
        return;
      }
    }
  }

  @HostListener('window:beforeinstallprompt', ['$event'])
  onBeforeInstallPrompt(event: Event) {
    event.preventDefault();
    this.deferredPrompt = event;

    // Check again for maybeLater setting
    const maybeLaterTime = localStorage.getItem('maybeLaterTime');
    if (maybeLaterTime) {
      const diff = Date.now() - parseInt(maybeLaterTime, 10);
      if (diff < 20 * 60 * 1000) {
        return;
      }
    }

    this.showInstallButton = true;

    // Auto-hide after 30 seconds
    this.hideTimeout = setTimeout(() => {
      this.showInstallButton = false;
    }, 30000);
  }

  promptInstall() {
    if (this.deferredPrompt) {
      this.deferredPrompt.prompt();
      this.deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
        this.clearInstallPrompt();
      });
    }
  }

  maybeLater() {
    this.showInstallButton = false;
    // Store timestamp
    localStorage.setItem('maybeLaterTime', Date.now().toString());
  }

  clearInstallPrompt() {
    this.deferredPrompt = null;
    this.showInstallButton = false;
    clearTimeout(this.hideTimeout);
  }
}
