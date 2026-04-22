import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyService } from '../../../services/company.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-analysis-survey',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './analysis-survey.component.html',
  styleUrls: ['./analysis-survey.component.css']
})
export class AnalysisSurveyComponent implements OnInit {

  surveys: any[] = [];
  totalSurveys: number = 0;
  totalResponses: number = 0;

  constructor(private companyService: CompanyService, private router: Router) { }

  ngOnInit(): void {
    this.fetchMetrics();
    this.fetchSurveys();
  }

  fetchMetrics() {
    this.companyService.getTotalResponses().subscribe({
      next: (res: any) => {
        if (res.success && res.data) {
          this.totalResponses = Array.isArray(res.data) ? res.data.length : (res.data || 0);
          console.log('totalResponse', this.totalResponses)
        }
      },
      error: (err) => console.error("Error fetching total responses", err)
    });
  }

  fetchSurveys() {
    this.companyService.getAllSurveys().subscribe({
      next: (res: any) => {
        if (res.success) {
          this.surveys = res.data;
          this.totalSurveys = this.surveys.length;
        }
      },
      error: (err) => console.error("Error fetching surveys", err)
    });
  }

  selectSurvey(survey: any) {
    this.router.navigate(['/dashboard/surveys/analysis', survey._id]);
  }

}
