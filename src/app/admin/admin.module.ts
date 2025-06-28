import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { FundListComponent } from './fund-list/fund-list.component';
import { ExpensesComponent } from './expenses/expenses.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { AddExpensesComponent } from './expenses/add-expenses/add-expenses.component';
import { AllotExpensesComponent } from './allot-expenses/allot-expenses.component';

@NgModule({
  declarations: [
    AdminComponent,
    FundListComponent,
    ExpensesComponent,
    DashboardComponent,
    AddExpensesComponent,
    AllotExpensesComponent,
  ],
  imports: [CommonModule, AdminRoutingModule, SharedModule],
})
export class AdminModule {}
