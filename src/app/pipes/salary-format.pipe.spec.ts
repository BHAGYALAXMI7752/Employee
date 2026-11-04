import { SalaryFormatPipe } from './salary-format.pipe';

describe('SalaryFormatPipe', () => {
  const pipe = new SalaryFormatPipe();
  it('formats Indian rupee amounts', () => expect(pipe.transform(65000)).toBe('₹65,000'));
  it('returns zero for zero', () => expect(pipe.transform(0)).toBe('₹0'));
  it('returns zero for undefined', () => expect(pipe.transform(undefined)).toBe('₹0'));
  it('returns zero for null', () => expect(pipe.transform(null)).toBe('₹0'));
});
