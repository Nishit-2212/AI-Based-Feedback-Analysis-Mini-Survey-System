import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyService } from '../../../services/company.service';

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

  selectedSurvey: any = null;
  loadingDetails: boolean = false;

  constructor(private companyService: CompanyService) {}

  ngOnInit(): void {
    this.fetchMetrics();
    this.fetchSurveys();
  }

  fetchMetrics() {
    this.companyService.getTotalResponses().subscribe({
      next: (res: any) => {
        if (res.success && res.data) {
          this.totalResponses = Array.isArray(res.data) ? res.data.length : (res.data || 0);
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
    this.loadingDetails = true;
    this.selectedSurvey = null; // Reset selection state
    
    // Fetch survey natively, populating 'questions' array
    this.companyService.getSurveyById(survey._id).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.selectedSurvey = res.data;
        }
      },
      error: (err) => console.error("Error fetching survey details", err),
      complete: () => {
        this.loadingDetails = false;
      }
    });
  }

}
