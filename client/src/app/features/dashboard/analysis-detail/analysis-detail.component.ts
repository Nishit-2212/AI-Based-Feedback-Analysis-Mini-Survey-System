import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { CompanyService } from '../../../services/company.service';
import { ActivatedRoute } from '@angular/router';
import * as Highcharts from 'highcharts';
import { HighchartsChartComponent, provideHighcharts } from 'highcharts-angular';

@Component({
  selector: 'app-analysis-detail',
  standalone: true,
  imports: [CommonModule, HighchartsChartComponent],
  templateUrl: './analysis-detail.component.html',
  styleUrls: ['./analysis-detail.component.css']
})
export class AnalysisDetailComponent implements OnInit {

  selectedSurvey: any = null;
  totalResponseOnSelectedSurvey: number = 0;
  Highcharts: typeof Highcharts = Highcharts;
  chartOptionsMap: { [key: string]: Highcharts.Options } = {};
  isLoading: boolean = true;

  constructor(
    private companyService: CompanyService, 
    private route: ActivatedRoute,
    private location: Location
  ) { }

  ngOnInit(): void {
    const surveyId = this.route.snapshot.paramMap.get('id');
    if (surveyId) {
      this.fetchSurveyDetails(surveyId);
    }
  }

  goBack(): void {
    this.location.back();
  }

  fetchSurveyDetails(surveyId: string) {
    this.companyService.getSurveyById(surveyId).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.selectedSurvey = res.data;
          this.fetchAndProcessResponses(surveyId);
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
          this.totalResponseOnSelectedSurvey = res.data.length;
          this.isLoading = false;
        }
      },
      error: (err) => {
        console.error("Error fetching survey responses:", err);
        this.isLoading = false;
      }
    });
  }

  processChartData(questions: any[], responses: any[]) {
    questions.forEach((q: any) => {
      if (q.questionType === 'MCQ' || q.questionType === 'MULTIPLE') {

        const answerCounts: { [key: string]: number } = {};
        if (q.options) {
          q.options.forEach((opt: string) => answerCounts[opt] = 0);
        }

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
