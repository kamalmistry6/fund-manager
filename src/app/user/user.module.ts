import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';
import { UserExpensesComponent } from './user-expenses/user-expenses.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [UserComponent, UserExpensesComponent],
  imports: [CommonModule, UserRoutingModule, SharedModule],
})
export class UserModule {}
