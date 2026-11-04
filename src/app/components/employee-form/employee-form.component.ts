import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EmployeePayload, EmployeeStatus } from '../../models/employee.model';
import { EmployeeService } from '../../services/employee.service';
import { EmployeeStateService } from '../../services/employee-state.service';
import { NotificationService } from '../../services/notification.service';

@Component({ selector: 'app-employee-form', standalone: true, imports: [ReactiveFormsModule], template: `
  <main class="page-shell narrow-shell"><button class="back-link" type="button" (click)="router.navigate(['/employees'])">← Employees</button><h1>{{ isEditMode ? 'Edit employee' : 'Add employee' }}</h1>
    <form [formGroup]="employeeForm" (ngSubmit)="submitForm()"><div class="form-group"><label for="empName">Name</label><input id="empName" formControlName="empName"><small class="field-error">{{ fieldError('empName') }}</small></div><div class="form-group"><label for="empEmail">Email</label><input id="empEmail" type="email" formControlName="empEmail"><small class="field-error">{{ fieldError('empEmail') }}</small></div><div class="form-group"><label for="empDept">Department</label><select id="empDept" formControlName="empDept"><option value="">Select department</option><option>Engineering</option><option>HR</option><option>Finance</option><option>Sales</option></select><small class="field-error">{{ fieldError('empDept') }}</small></div><div class="form-group"><label for="empSalary">Salary</label><input id="empSalary" type="number" min="1" formControlName="empSalary"><small class="field-error">{{ fieldError('empSalary') }}</small></div><fieldset class="form-group"><legend>Status</legend><label class="radio-option"><input type="radio" value="active" formControlName="empStatus"> Active</label><label class="radio-option"><input type="radio" value="inactive" formControlName="empStatus"> Inactive</label></fieldset><button class="primary-button" type="submit" [disabled]="employeeForm.invalid || saving">{{ saving ? 'Saving…' : 'Save employee' }}</button></form>
  </main>` })
export class EmployeeFormComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly employeeService = inject(EmployeeService);
  private readonly employeeStateService = inject(EmployeeStateService);
  private readonly notificationService = inject(NotificationService);
  private readonly route = inject(ActivatedRoute);
  readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private empId: number | null = null;
  isEditMode = false;
  saving = false;
  readonly employeeForm = this.formBuilder.nonNullable.group({ empName: ['', Validators.required], empEmail: ['', [Validators.required, Validators.email]], empDept: ['', Validators.required], empSalary: [0, [Validators.required, Validators.min(1)]], empStatus: ['active' as EmployeeStatus, Validators.required] });

  ngOnInit(): void {
    const routeEmpId = this.route.snapshot.paramMap.get('empId');
    if (routeEmpId) {
      this.empId = Number(routeEmpId);
      this.isEditMode = true;
      this.employeeService.getEmployeeById(this.empId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({ next: employee => this.employeeForm.patchValue(employee), error: () => this.notificationService.showMessage('Could not load employee.') });
    }
  }

  fieldError(field: 'empName' | 'empEmail' | 'empDept' | 'empSalary'): string {
    const control = this.employeeForm.controls[field];
    if (!control.touched || control.valid) return '';
    if (control.hasError('email')) return 'Enter a valid email address.';
    if (control.hasError('min')) return 'Salary must be greater than zero.';
    return 'This field is required.';
  }

  submitForm(): void {
    if (this.employeeForm.invalid) { this.employeeForm.markAllAsTouched(); return; }
    const payload = this.employeeForm.getRawValue() as EmployeePayload;
    this.saving = true;
    const request = this.isEditMode && this.empId !== null ? this.employeeStateService.updateEmployee(this.empId, payload) : this.employeeStateService.addEmployee(payload);
    request.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({ next: () => { this.saving = false; this.notificationService.showMessage(this.isEditMode ? 'Employee updated.' : 'Employee added.'); void this.router.navigate(['/employees']); }, error: () => { this.saving = false; this.notificationService.showMessage('Could not save employee.'); } });
  }
}
