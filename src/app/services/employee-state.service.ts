import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, combineLatest, distinctUntilChanged, map, tap } from 'rxjs';
import { Employee, EmployeePayload } from '../models/employee.model';
import { EmployeeService } from './employee.service';

@Injectable({ providedIn: 'root' })
export class EmployeeStateService {
  private readonly employeeService = inject(EmployeeService);
  private readonly employeesSubject = new BehaviorSubject<Employee[]>([]);
  private readonly loadingSubject = new BehaviorSubject<boolean>(false);
  private readonly searchTermSubject = new BehaviorSubject<string>('');
  private readonly deptFilterSubject = new BehaviorSubject<string>('all');
  private readonly statusFilterSubject = new BehaviorSubject<string>('all');

  readonly employees$ = this.employeesSubject.asObservable();
  readonly loading$ = this.loadingSubject.asObservable();
  readonly filteredEmployees$ = combineLatest([this.employees$, this.searchTermSubject, this.deptFilterSubject, this.statusFilterSubject]).pipe(
    map(([employees, searchTerm, department, status]) => {
      const normalizedSearch = searchTerm.trim().toLowerCase();
      return employees.filter(employee => (!normalizedSearch || employee.empName.toLowerCase().includes(normalizedSearch) || employee.empEmail.toLowerCase().includes(normalizedSearch)) && (department === 'all' || employee.empDept === department) && (status === 'all' || employee.empStatus === status));
    }),
    distinctUntilChanged((previous, current) => previous.length === current.length && previous.every((employee, index) => employee.empId === current[index].empId))
  );

  setLoading(isLoading: boolean): void { this.loadingSubject.next(isLoading); }
  setSearchTerm(searchTerm: string): void { this.searchTermSubject.next(searchTerm); }
  setDeptFilter(department: string): void { this.deptFilterSubject.next(department); }
  setStatusFilter(status: string): void { this.statusFilterSubject.next(status); }

  loadEmployees() { return this.employeeService.getEmployees().pipe(tap(employees => this.employeesSubject.next(employees))); }
  addEmployee(payload: EmployeePayload) { return this.employeeService.addEmployee(payload).pipe(tap(employee => this.employeesSubject.next([...this.employeesSubject.value, employee]))); }
  updateEmployee(empId: number, payload: EmployeePayload) { return this.employeeService.updateEmployee(empId, payload).pipe(tap(updated => this.employeesSubject.next(this.employeesSubject.value.map(employee => employee.empId === empId ? updated : employee)))); }
  deleteEmployee(empId: number) { return this.employeeService.deleteEmployee(empId).pipe(tap(() => this.employeesSubject.next(this.employeesSubject.value.filter(employee => employee.empId !== empId)))); }
  toggleEmployeeStatus(employee: Employee) {
    const empStatus = employee.empStatus === 'active' ? 'inactive' : 'active';
    return this.employeeService.patchEmployeeStatus(employee.empId, empStatus).pipe(tap(updated => this.employeesSubject.next(this.employeesSubject.value.map(current => current.empId === employee.empId ? updated : current))));
  }
}
