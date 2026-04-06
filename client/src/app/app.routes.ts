import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component';
import { DashboardHomeComponent } from './features/dashboard/dashboard-home/dashboard-home.component';
import { CreateSurveyComponent } from './features/dashboard/create-survey/create-survey.component';
import { CompanyListComponent } from './features/user/company-list/company-list.component';
import { CompanySurveysComponent } from './features/user/company-surveys/company-surveys.component';
import { SurveyIntroComponent } from './features/user/survey-intro/survey-intro.component';
import { SurveyLayoutComponent } from './layouts/survey-layout/survey-layout.component';
import { SurveyDisplayComponent } from './features/user/survey-display/survey-display.component';
import { AnalysisSurveyComponent } from './features/dashboard/analysis-survey/analysis-survey.component';
import { GivenSurveysComponent } from './features/user/given-surveys/given-surveys.component';

export const routes: Routes = [
  { 
    path: '', 
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
      { path: 'home', component: CompanyListComponent },
      { path: 'company/:id/surveys', component: CompanySurveysComponent },
      { path: 'survey/:id/intro', component: SurveyIntroComponent },
      { path: 'my-surveys', component: GivenSurveysComponent },
      { path: 'auth', loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule) }
    ]
  },
  {
    path: 'dashboard',
    component: DashboardLayoutComponent,
    children: [
      { path: '', component: DashboardHomeComponent },
      { path: 'surveys/new', component: CreateSurveyComponent },
      { path: 'surveys/analysis', component: AnalysisSurveyComponent }
    ]
  },
  {
    path: 'take/:surveyId/td/:transactionId',
    component: SurveyLayoutComponent,
    children: [
      { path: '', component: SurveyDisplayComponent }
    ]
  }
];
