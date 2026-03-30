import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component';
import { DashboardHomeComponent } from './features/dashboard/dashboard-home/dashboard-home.component';
import { CreateSurveyComponent } from './features/dashboard/create-survey/create-survey.component';
import { CompanyListComponent } from './features/user/company-list/company-list.component';
import { CompanySurveysComponent } from './features/user/company-surveys/company-surveys.component';

export const routes: Routes = [
  { 
    path: '', 
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
      { path: 'home', component: CompanyListComponent },
      { path: 'company/:id/surveys', component: CompanySurveysComponent },
      { path: 'auth', loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule) }
    ]
  },
  {
    path: 'dashboard',
    component: DashboardLayoutComponent,
    children: [
      { path: '', component: DashboardHomeComponent },
      { path: 'surveys/new', component: CreateSurveyComponent }
    ]
  }
];
