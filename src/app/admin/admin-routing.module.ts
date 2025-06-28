import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FundListComponent } from './fund-list/fund-list.component';
import { ExpensesComponent } from './expenses/expenses.component';
import { AllotExpensesComponent } from './allot-expenses/allot-expenses.component';

const routes: Routes = [
  { path: '', component: AdminComponent },
  {
    path: 'Dashboard',
    component: DashboardComponent,
  },
  {
    path: 'fund-list',
    component: FundListComponent,
  },
  {
    path: 'fund-expenses',
    component: ExpensesComponent,
  },
  {
    path: 'allot-expenses',
    component: AllotExpensesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
