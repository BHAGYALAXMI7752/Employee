import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { EmployeeStateService } from '../services/employee-state.service';

export const loadingInterceptor: HttpInterceptorFn = (request, next) => {
  const employeeStateService = inject(EmployeeStateService);
  employeeStateService.setLoading(true);
  return next(request).pipe(finalize(() => employeeStateService.setLoading(false)));
};
