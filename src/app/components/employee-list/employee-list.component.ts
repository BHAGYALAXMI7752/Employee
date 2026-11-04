import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { AsyncPipe, NgClass, NgStyle } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Employee } from '../../models/employee.model';
import { EmployeeStateService } from '../../services/employee-state.service';
import { NotificationService } from '../../services/notification.service';
import { SalaryFormatPipe } from '../../pipes/salary-format.pipe';
import { HighlightDirective } from '../../directives/highlight.directive';
import { EmployeeFiltersComponent } from '../employee-filters/employee-filters.component';

@Component({ selector: 'app-employee-list', standalone: true, imports: [AsyncPipe, NgClass, NgStyle, RouterLink, SalaryFormatPipe, HighlightDirective, EmployeeFiltersComponent], template: `
  <main class="page-shell"><div class="page-heading"><div><p class="eyebrow">PEOPLE DIRECTORY</p><h1>Employees</h1></div><button class="primary-button" type="button" (click)="router.navigate(['/employees/new'])">Add employee</button></div>
    <app-employee-filters />
    @if (employeeStateService.loading$ | async) { <div class="spinner" role="status">Loading employees…</div> }
    @if (employees$ | async; as employees) {
      @if (employees.length === 0) { <section class="empty-state"><h2>No employees found</h2><p>Add an employee or adjust your filters.</p></section> }
      @for (emp of employees; track emp.empId) {
        <article class="employee-row" [appHighlight]="'lightblue'"><div class="employee-main"><div class="avatar">{{ emp.empName.slice(0, 1).toUpperCase() }}</div><div><a class="employee-name" [routerLink]="['/employee', emp.empId]">{{ emp.empName }}</a><div class="employee-meta">{{ emp.empDept }} · {{ emp.empEmail }}</div></div></div><div class="employee-salary" [ngStyle]="{ color: emp.empSalary < 30000 ? '#d34b4b' : null }">{{ emp.empSalary | salaryFormat }}</div><span class="badge" [ngClass]="emp.empStatus === 'active' ? 'badge-active' : 'badge-inactive'">@switch (emp.empStatus) { @case ('active') { Active } @case ('inactive') { Inactive } }</span><div class="row-actions"><button type="button" (click)="router.navigate(['/employees/edit', emp.empId])">Edit</button><button type="button" (click)="toggleStatus(emp)">Toggle status</button><button class="danger-action" type="button" (click)="removeEmployee(emp.empId)">Delete</button></div></article>
      }
    }
  </main>` })
export class EmployeeListComponent implements OnInit {
  readonly employeeStateService = inject(EmployeeStateService);
  readonly router = inject(Router);
  private readonly notificationService = inject(NotificationService);
  private readonly destroyRef = inject(DestroyRef);
  readonly employees$ = this.employeeStateService.filteredEmployees$;

  ngOnInit(): void { this.employeeStateService.loadEmployees().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({ error: () => this.notificationService.showMessage('Could not load employees.') }); }
  removeEmployee(empId: number): void { this.employeeStateService.deleteEmployee(empId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({ next: () => this.notificationService.showMessage('Employee deleted.'), error: () => this.notificationService.showMessage('Could not delete employee.') }); }
  toggleStatus(employee: Employee): void { this.employeeStateService.toggleEmployeeStatus(employee).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({ error: () => this.notificationService.showMessage('Could not update employee status.') }); }
}
