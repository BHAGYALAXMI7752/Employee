import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Employee, EmployeePayload } from '../models/employee.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/employees`;

  getEmployees(): Observable<Employee[]> { return this.http.get<Employee[]>(this.apiUrl).pipe(catchError(error => this.handleError(error))); }
  getEmployeeById(empId: number): Observable<Employee> { return this.http.get<Employee>(`${this.apiUrl}/${empId}`).pipe(catchError(error => this.handleError(error))); }
  addEmployee(payload: EmployeePayload): Observable<Employee> { return this.http.post<Employee>(this.apiUrl, payload).pipe(catchError(error => this.handleError(error))); }
  updateEmployee(empId: number, payload: EmployeePayload): Observable<Employee> { return this.http.put<Employee>(`${this.apiUrl}/${empId}`, payload).pipe(catchError(error => this.handleError(error))); }
  patchEmployeeStatus(empId: number, empStatus: string): Observable<Employee> { return this.http.patch<Employee>(`${this.apiUrl}/${empId}`, { empStatus }).pipe(catchError(error => this.handleError(error))); }
  deleteEmployee(empId: number): Observable<void> { return this.http.delete<void>(`${this.apiUrl}/${empId}`).pipe(catchError(error => this.handleError(error))); }

  private handleError(error: unknown): Observable<never> {
    console.error('Employee API request failed', error);
    const message = error instanceof Error ? error.message : 'Unable to complete the employee request.';
    return throwError(() => new Error(message));
  }
}
