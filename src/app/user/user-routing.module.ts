import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserExpensesComponent } from './user-expenses/user-expenses.component';

const routes: Routes = [
  { path: 'user-expenses', component: UserExpensesComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
