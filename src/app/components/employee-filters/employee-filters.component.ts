import { Component, DestroyRef, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EmployeeStateService } from '../../services/employee-state.service';

@Component({ selector: 'app-employee-filters', standalone: true, imports: [FormsModule, ReactiveFormsModule], template: `
  <section class="filter-bar">
    <label>Search <input type="search" [formControl]="searchControl" placeholder="Name or email"></label>
    <label>Department <select [(ngModel)]="selectedDepartment" (ngModelChange)="employeeStateService.setDeptFilter($event)"><option value="all">All departments</option><option value="Engineering">Engineering</option><option value="HR">HR</option><option value="Finance">Finance</option><option value="Sales">Sales</option></select></label>
    <div class="status-filters" aria-label="Filter by status"><button type="button" (click)="setStatus('all')">All</button><button type="button" (click)="setStatus('active')">Active</button><button type="button" (click)="setStatus('inactive')">Inactive</button></div>
  </section>
  ` })
export class EmployeeFiltersComponent {
  readonly employeeStateService = inject(EmployeeStateService);
  private readonly destroyRef = inject(DestroyRef);
  readonly searchControl = new FormControl('', { nonNullable: true });
  selectedDepartment = 'all';

  constructor() {
    this.searchControl.valueChanges.pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef)).subscribe(searchTerm => this.employeeStateService.setSearchTerm(searchTerm));
  }

  setStatus(status: string): void { this.employeeStateService.setStatusFilter(status); }
}
