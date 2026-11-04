import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BehaviorSubject, catchError, of, switchMap, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Employee } from '../../models/employee.model';
import { ApiState } from '../../models/api-response.model';
import { EmployeeService } from '../../services/employee.service';
import { SalaryFormatPipe } from '../../pipes/salary-format.pipe';

@Component({ selector: 'app-employee-detail', standalone: true, imports: [AsyncPipe, RouterLink, SalaryFormatPipe], template: `
  <main class="page-shell narrow-shell"><a class="back-link" routerLink="/employees">← Employees</a>
    @if (employeeState$ | async; as state) {
      @if (state.loading) { <div class="spinner">Loading employee…</div> }
      @if (state.error) { <p class="error-message">{{ state.error }}</p> }
      @if (state.data; as employee) { <section class="detail-card"><p class="eyebrow">EMPLOYEE PROFILE</p><h1>{{ employee.empName }}</h1><dl><dt>Employee ID</dt><dd>{{ employee.empId }}</dd><dt>Department</dt><dd>{{ employee.empDept }}</dd><dt>Email</dt><dd>{{ employee.empEmail }}</dd><dt>Salary</dt><dd>{{ employee.empSalary | salaryFormat }}</dd><dt>Status</dt><dd>{{ employee.empStatus }}</dd></dl></section> }
    }
  </main>` })
export class EmployeeDetailComponent implements OnInit {
  private readonly employeeService = inject(EmployeeService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly employeeStateSubject = new BehaviorSubject<ApiState<Employee>>({ data: null, loading: true, error: null });
  readonly employeeState$ = this.employeeStateSubject.asObservable();

  ngOnInit(): void {
    this.route.paramMap.pipe(tap(() => this.employeeStateSubject.next({ data: null, loading: true, error: null })), switchMap(params => this.employeeService.getEmployeeById(Number(params.get('empId'))).pipe(tap(data => this.employeeStateSubject.next({ data, loading: false, error: null })), catchError(() => { this.employeeStateSubject.next({ data: null, loading: false, error: 'Could not load this employee.' }); return of(null); }))), takeUntilDestroyed(this.destroyRef)).subscribe();
  }
}
