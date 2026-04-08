import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CompanyService } from '../../../services/company.service';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.css']
})
export class DashboardHomeComponent implements OnInit {
  surveys: any[] = [];
  companyService = inject(CompanyService);

  ngOnInit() {
    this.fetchSurveys();
  }

  fetchSurveys() {
    this.companyService.getAllSurveys().subscribe({
      next: (res) => {
        if (res.success) {
          this.surveys = res.data;
        }
      },
      error: (err) => console.error('Error fetching surveys:', err)
    });
  }



  toggleStatus(survey: any) {
    const previousStatus = survey.isActive;
    survey.isActive = !survey.isActive;

    this.companyService.toggleSurveyStatus(survey._id).subscribe({
      next: (res: any) => {
        if (!res.success) {
          survey.isActive = previousStatus;
          alert('Failed to update status');
        }
      },
      error: (err: any) => {
        survey.isActive = previousStatus;
        console.error('Error updating status:', err);
      }
    });
  }

  deleteSurvey(surveyId: string) {
      this.companyService.deleteSurvey(surveyId).subscribe({
        next: (res) => {
          if (res.success) {
            this.surveys = this.surveys.filter((s) => s._id !== surveyId);
          }
        },
        error: (err) => console.error('Error deleting survey:', err)
      });
  }

  copyToClipboard(url: string) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        alert('Survey Link copied to clipboard!');
      }).catch(err => {
        console.error('Failed to copy: ', err);
      });
    } else {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        alert('Survey Link copied to clipboard!');
      } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
      }
      document.body.removeChild(textArea);
    }
  }
}
