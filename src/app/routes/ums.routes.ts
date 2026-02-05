import { Routes } from '@angular/router';
import { UserViewPageComponent } from '../pages/ums/user/view/user-view.page';
import { UserCreatePageComponent } from '../pages/ums/user/create/user-create.page';
import { UserEditPageComponent } from '../pages/ums/user/edit/user-edit.page';
import { RoleViewPageComponent } from '../pages/ums/role/view/role-view.page';
import { RoleCreatePageComponent } from '../pages/ums/role/create/role-create.page';
import { RoleEditPageComponent } from '../pages/ums/role/edit/role-edit.page';

export const umsRoutes: Routes = [
  {
    path: 'users',
    children: [
      {
        path: '',
        component: UserViewPageComponent
      },
      {
        path: 'create',
        component: UserCreatePageComponent
      },
      {
        path: ':id/edit',
        component: UserEditPageComponent
      }
    ]
  },
  {
    path: 'roles',
    children: [
      {
        path: '',
        component: RoleViewPageComponent
      },
      {
        path: 'create',
        component: RoleCreatePageComponent
      },
      {
        path: ':id/edit',
        component: RoleEditPageComponent
      }
    ]
  },
  {
    path: '',
    redirectTo: 'users',
    pathMatch: 'full'
  }
];

