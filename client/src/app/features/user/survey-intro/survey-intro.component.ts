import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-survey-intro',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './survey-intro.component.html',
  styleUrls: ['./survey-intro.component.css']
})
export class SurveyIntroComponent implements OnInit {

  surveyId: string | null = null;
  surveyDetails: any = null;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.surveyId = this.route.snapshot.paramMap.get('id');

    if (this.surveyId) {
      this.fetchSurveyDetails();
    } else {
      this.router.navigate(['/home']);
    }
  }

  fetchSurveyDetails() {
    this.userService.getSurveyInfo(this.surveyId!).subscribe({
      next: (res) => {
        if (res.success) {
          this.surveyDetails = res.data;
        } else {
          this.error = "There is something wrong while fetching the survey.";
        }
      },
      error: (err) => {
        console.error('Failed to load survey intro', err);
        this.error = "Survey not found.";
      }
    });
  }

  startSurvey() {
    if (!this.surveyId) return;

    this.userService.startSurveyTransaction(this.surveyId).subscribe({
      next: (res) => {
        if (res.success && res.data?.transactionId) {
          const tId = res.data.transactionId;
          
          localStorage.setItem(`survey_questions`, JSON.stringify(res.data.questions));
          localStorage.setItem(`survey_Name`, res.data.surveyName);
          
          // Route out of MainLayout to the pure distraction-free Survey Layout
          this.router.navigate(['/take', this.surveyId, 'td', tId]);
        } else {
          this.error = "Failed .";
        }
      },
      error: (err) => {
        console.error('Failed to start survey', err);
        this.error = "Error starting the survey transaction.";
      }
    });
  }

  goBack() {
    if (this.surveyDetails?.companyId?._id) {
       this.router.navigate(['/company', this.surveyDetails.companyId._id, 'surveys']);
    } else {
       this.router.navigate(['/home']);
    }
  }
}
