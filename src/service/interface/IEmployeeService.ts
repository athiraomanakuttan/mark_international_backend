import { EmployeeBasicType, UpdateEmployeeType, EmployeeFilterType } from '../../types/employeeTypes';
import { EmployeeDto } from '../../dto/dtoTypes/employeeDto';

export interface IEmployeeService {
  createEmployee(employeeData: EmployeeBasicType): Promise<EmployeeDto>;
  getEmployees(page: number, limit: number, filterData: EmployeeFilterType, search: string): Promise<{ employees: EmployeeDto[], totalRecords: number }>;
  getEmployeeById(employeeId: string): Promise<EmployeeDto | null>;
  updateEmployee(employeeId: string, employeeData: UpdateEmployeeType): Promise<EmployeeDto | null>;
  deleteEmployee(employeeId: string): Promise<boolean>;
  getAllActiveEmployees(): Promise<EmployeeDto[]>;
}