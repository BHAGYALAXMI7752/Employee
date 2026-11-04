import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { filter, firstValueFrom } from 'rxjs';
import { EmployeeStateService } from './employee-state.service';
import { Employee } from '../models/employee.model';

describe('EmployeeStateService', () => {
  let employeeStateService: EmployeeStateService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    employeeStateService = TestBed.inject(EmployeeStateService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTestingController.verify());

  it('filters employees by active status', async () => {
    const employees: Employee[] = [
      { empId: 1, empName: 'Active Person', empDept: 'Engineering', empSalary: 65000, empStatus: 'active', empEmail: 'active@example.com' },
      { empId: 2, empName: 'Inactive Person', empDept: 'HR', empSalary: 45000, empStatus: 'inactive', empEmail: 'inactive@example.com' }
    ];
    const filteredEmployeesPromise = firstValueFrom(employeeStateService.filteredEmployees$.pipe(filter(filteredEmployees => filteredEmployees.length > 0)));
    employeeStateService.setStatusFilter('active');
    employeeStateService.loadEmployees().subscribe();
    httpTestingController.expectOne('http://localhost:3000/employees').flush(employees);
    const filteredEmployees = await filteredEmployeesPromise;
    expect(filteredEmployees.length).toBe(1);
    expect(filteredEmployees[0].empStatus).toBe('active');
  });
});
