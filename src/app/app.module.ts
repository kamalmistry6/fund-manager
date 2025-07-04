import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { LayoutComponent } from './layout/layout.component';
import { IconService } from './services/icon.service';
import { PermissionService } from './services/permission.service';
import { ServiceWorkerModule } from '@angular/service-worker';

@NgModule({
  declarations: [AppComponent, NavbarComponent, LayoutComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, ServiceWorkerModule.register('ngsw-worker.js', {
  enabled: !isDevMode(),
  // Register the ServiceWorker as soon as the application is stable
  // or after 30 seconds (whichever comes first).
  registrationStrategy: 'registerWhenStable:30000'
})],
  providers: [IconService, PermissionService],

  bootstrap: [AppComponent],
})
export class AppModule {}
