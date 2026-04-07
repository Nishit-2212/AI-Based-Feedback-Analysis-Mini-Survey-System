import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyService } from '../../../services/company.service';
import * as Highcharts from 'highcharts';
import { HighchartsChartComponent, provideHighcharts } from 'highcharts-angular';

@Component({
  selector: 'app-analysis-survey',
  standalone: true,
  imports: [CommonModule, HighchartsChartComponent],
  templateUrl: './analysis-survey.component.html',
  styleUrls: ['./analysis-survey.component.css']
})
export class AnalysisSurveyComponent implements OnInit {

  surveys: any[] = [];
  totalSurveys: number = 0;
  totalResponses: number = 0;

  totalResponseOnSelectedSurvey: number = 0;

  selectedSurvey: any = null;

  Highcharts: typeof Highcharts = Highcharts;
  chartOptionsMap: { [key: string]: Highcharts.Options } = {};

  constructor(private companyService: CompanyService) { }

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

    this.selectedSurvey = null; // Reset selection state
    this.chartOptionsMap = {};

    // Fetch survey natively, populating 'questions' array
    this.companyService.getSurveyById(survey._id).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.selectedSurvey = res.data;
          this.fetchAndProcessResponses(survey._id);
        }
      },
      error: (err) => console.error("Error fetching survey details", err),
    });
  }

  fetchAndProcessResponses(surveyId: string) {
    this.companyService.getSurveyResponses(surveyId).subscribe({
      next: (res: any) => {
        if (res.success && res.data) {
          this.processChartData(this.selectedSurvey.questions || [], res.data);
          console.log('total response on selected survey is', res.data.length)
          this.totalResponseOnSelectedSurvey = res.data.length;
        }
      },
      error: (err) => console.error("Error fetching survey responses:", err)
    });
  }

  processChartData(questions: any[], responses: any[]) {
    questions.forEach((q: any) => {
      if (q.questionType === 'MCQ' || q.questionType === 'MULTIPLE') {

        // Map options to zero frequencies
        const answerCounts: { [key: string]: number } = {};
        if (q.options) {
          q.options.forEach((opt: string) => answerCounts[opt] = 0);
        }

        // Loop through raw responses to build the exact aggregates
        responses.forEach((session: any) => {
          const match = session.answers.find((ans: any) => ans.questionKey === q.questionKey);
          if (match && match.answer) {
            match.answer.forEach((selectedOpt: string) => {
              if (answerCounts[selectedOpt] !== undefined) {
                answerCounts[selectedOpt]++;
              } else {
                answerCounts[selectedOpt] = 1;
              }
            });
          }
        });

        // Format securely into Highcharts standard formatting
        const seriesData = Object.keys(answerCounts).map(opt => ({
          name: opt,
          y: answerCounts[opt]
        }));

        this.chartOptionsMap[q._id] = {
          chart: {
            type: 'pie',
            zooming: { type: 'xy' },
            panning: { enabled: true, type: 'xy' }
          },
          title: { text: 'Audience Response Data' },
          tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b> ({point.y})'
          },
          plotOptions: {
            pie: {
              allowPointSelect: true,
              cursor: 'pointer',
              dataLabels: [{ enabled: true, distance: 20 }, {
                enabled: true,
                distance: -40,
                format: '{point.percentage:.1f}%',
                style: { fontSize: '1.2em', textOutline: 'none', opacity: 0.7 }
              }]
            }
          },
          series: [{
            type: 'pie',
            name: 'Selections',
            colorByPoint: true,
            data: seriesData
          }]
        } as any;
      }
    });
  }

}
