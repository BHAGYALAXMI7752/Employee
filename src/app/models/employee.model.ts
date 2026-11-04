export type EmployeeStatus = 'active' | 'inactive';

export interface Employee {
  empId: number;
  empName: string;
  empDept: string;
  empSalary: number;
  empStatus: EmployeeStatus;
  empEmail: string;
}

export type EmployeePayload = Omit<Employee, 'empId'>;
