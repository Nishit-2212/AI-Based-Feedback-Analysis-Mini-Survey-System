import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-company-surveys',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './company-surveys.component.html',
  styleUrls: ['./company-surveys.component.css']
})
export class CompanySurveysComponent implements OnInit {
  companyId: string | null = null;
  companyName: string = 'Company';
  surveys: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    
    this.companyId = this.route.snapshot.paramMap.get('id');

    if (this.companyId) {
      this.fetchSurveys(this.companyId);
    } else {
      this.router.navigate(['/home']);
    }
  }

  fetchSurveys(id: string) {
    this.userService.getCompanySurveys(id).subscribe({
      next: (res) => {
        if (res.success) {
          this.surveys = res.data;
          this.companyName = res.companyName || 'Company';
        }
      },
      error: (err) => {
        console.error('Failed to load surveys', err);
      }
    });
  }

  takeSurvey(surveyId: string) {
    this.router.navigate([`/survey/${surveyId}/intro`]);
  }

  goBack() {
    this.router.navigate(['/home']); 
  }
}
