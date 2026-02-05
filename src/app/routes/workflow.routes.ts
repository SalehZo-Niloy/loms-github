import { Routes } from '@angular/router';

export const workflowRoutes: Routes = [
  {
    path: 'work-flow',
    loadComponent: () =>
      import('../pages/workflow/work-flow/work-flow.page').then((m) => m.WorkFlowPageComponent),
  },
  {
    path: 'test-work-flow',
    loadComponent: () =>
      import('../pages/workflow/test-work-flow/test-work-flow.page').then(
        (m) => m.TestWorkFlowPageComponent,
      ),
  },
  {
    path: '',
    redirectTo: 'work-flow',
    pathMatch: 'full',
  },
];
