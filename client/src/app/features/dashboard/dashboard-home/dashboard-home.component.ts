import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.css']
})
export class DashboardHomeComponent {
  surveys = [
    { id: 1, ref: 'AI', name: 'Product Feedback', desc: 'Q1 AI feature feedback', owner: 'Company Admin', date: 'Feb 16, 2025 at 17:53', status: 'Active' },
    { id: 2, ref: 'HR', name: 'Employee Satisfaction', desc: 'Annual company survey', owner: 'Company Admin', date: 'Feb 10, 2025 at 09:12', status: 'Closed' },
    { id: 3, ref: 'Beta', name: 'Beta Program Opt-in', desc: 'For early access users', owner: 'Company Admin', date: 'Feb 05, 2025 at 14:30', status: 'Draft' },
    { id: 4, ref: 'UX', name: 'Dashboard Redesign', desc: 'Gathering UI feedback', owner: 'Company Admin', date: 'Jan 28, 2025 at 11:00', status: 'Active' },
    { id: 5, ref: 'Sales', name: 'Quarterly Review', desc: 'Internal sales team review', owner: 'Company Admin', date: 'Jan 15, 2025 at 16:45', status: 'Closed' }
  ];
}
