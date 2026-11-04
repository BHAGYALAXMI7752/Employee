import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'salaryFormat', standalone: true, pure: true })
export class SalaryFormatPipe implements PipeTransform {
  private readonly formatter = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

  transform(salary: number | null | undefined): string {
    if (!salary) return '₹0';
    return this.formatter.format(salary);
  }
}
