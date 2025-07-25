import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FundListComponent } from './fund-list/fund-list.component';
import { ExpensesComponent } from './expenses/expenses.component';
import { AllotExpensesComponent } from './allot-expenses/allot-expenses.component';
import { ViewReceiptComponent } from './fund-list/view-receipt/view-receipt.component';

const routes: Routes = [
  { path: '', component: AdminComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'funds',
    component: FundListComponent,
  },
  {
    path: 'view-receipt',
    component: ViewReceiptComponent,
  },
  {
    path: 'expenses',
    component: ExpensesComponent,
  },
  {
    path: 'allotments',
    component: AllotExpensesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
