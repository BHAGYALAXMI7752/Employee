import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'employees' },
  { path: 'employees', loadComponent: () => import('./components/employee-list/employee-list.component').then(component => component.EmployeeListComponent) },
  { path: 'employees/new', loadComponent: () => import('./components/employee-form/employee-form.component').then(component => component.EmployeeFormComponent) },
  { path: 'employees/edit/:empId', loadComponent: () => import('./components/employee-form/employee-form.component').then(component => component.EmployeeFormComponent) },
  { path: 'employee/:empId', loadComponent: () => import('./components/employee-detail/employee-detail.component').then(component => component.EmployeeDetailComponent) },
  { path: '**', redirectTo: 'employees' }
];
