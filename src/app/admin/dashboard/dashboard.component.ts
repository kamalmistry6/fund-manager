import { Component } from '@angular/core';
import { ExpensesDashboardStats } from '../models/ExpensesDashboardStats';
import { DashboardService } from '../Services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  stats?: ExpensesDashboardStats;
  isPopupOpen = false;
  users: any[] = [];

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.getDashboardStats();
  }

  togglePopup() {
    this.isPopupOpen = !this.isPopupOpen;
  }

  getDashboardStats(): void {
    this.dashboardService.getdashboardStats().subscribe(
      (data: ExpensesDashboardStats) => {
        this.stats = data;
      },
      (error) => {
        console.error('Error fetching dashboard stats data:', error);
      }
    );
  }
}
