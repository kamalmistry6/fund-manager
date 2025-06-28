import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { LayoutComponent } from './layout/layout.component';
import { IconService } from './services/icon.service';
import { PermissionService } from './services/permission.service';

@NgModule({
  declarations: [AppComponent, NavbarComponent, LayoutComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule],
  providers: [IconService, PermissionService],

  bootstrap: [AppComponent],
})
export class AppModule {}
