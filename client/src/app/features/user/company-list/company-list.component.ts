import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-company-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.css']
})
export class CompanyListComponent implements OnInit {
  companies: any[] = [];
  

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.fetchCompanies();
  }

  fetchCompanies() {
    this.userService.getAllCompanies().subscribe({
      next: (res) => {
        if (res.success) {
          this.companies = res.data;
        }
      },
      error: (err) => {
        console.error('Something Goes wrong', err);
      }
    });
  }

  viewSurveys(companyId: string) {
    this.router.navigate([`/company/${companyId}/surveys`]);
  }
}
