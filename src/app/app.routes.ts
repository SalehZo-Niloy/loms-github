import { Routes } from '@angular/router';
import { LoginPageComponent } from './pages/login/login.page';
import { DashboardPageComponent } from './pages/dashboard/dashboard.page';
import { tradeRoutes } from './routes/trade.routes';
import { umsRoutes } from './routes/ums.routes';
import { workflowRoutes } from './routes/workflow.routes';
import { lomsRoutes } from './routes/loms.routes';

export const routes: Routes = [
  {
    path: '',
    component: LoginPageComponent,
  },
  {
    path: 'dashboard',
    component: DashboardPageComponent,
  },
  {
    path: 'dashboard/:solution',
    component: DashboardPageComponent,
  },
  {
    path: 'trade',
    children: tradeRoutes
  },
  {
    path: 'ums',
    children: umsRoutes
  },
  {
    path: 'workflow',
    children: workflowRoutes
  },
  {
    path: 'loms',
    children: lomsRoutes
  }
];
 