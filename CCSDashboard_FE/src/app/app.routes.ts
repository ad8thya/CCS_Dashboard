import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { loginGuard } from './guards/login.guard';
import { LoginComponent } from './components/login/login';
import { LayoutComponent } from './components/layout/layout';
import { Dashboard } from './components/dashboard/dashboard';
import { Reports } from './components/reports/reports';
import { ReportsHubComponent } from './components/reports/reports-hub/reports-hub';
import { CompetencyRegisterComponent } from './components/reports/competency-register/competency-register';
import { ActiveCertificatesComponent } from './components/reports/active-certificates/active-certificates';
import { BatchSummaryComponent } from './components/reports/batch-summary/batch-summary';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [loginGuard],
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: Dashboard },
      {
        path: 'reports',
        component: Reports,
        children: [
          { path: '', component: ReportsHubComponent },
          { path: 'competency-register', component: CompetencyRegisterComponent },
          { path: 'active-certificates', component: ActiveCertificatesComponent },
          { path: 'batch-summary', component: BatchSummaryComponent },
        ],
      },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];
