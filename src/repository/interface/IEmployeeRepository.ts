import { EmployeeBasicType, EmployeeType, UpdateEmployeeType, EmployeeFilterType, EmployeeResponseType } from '../../types/employeeTypes';

export interface IEmployeeRepository {
  createEmployee(employeeData: EmployeeBasicType): Promise<EmployeeType>;
  getEmployees(page: number, limit: number, filterData: EmployeeFilterType, search: string): Promise<EmployeeResponseType>;
  getEmployeeById(employeeId: string): Promise<EmployeeType | null>;
  updateEmployee(employeeId: string, employeeData: UpdateEmployeeType): Promise<EmployeeType | null>;
  deleteEmployee(employeeId: string): Promise<boolean>;
  checkEmailExists(email: string, excludeId?: string): Promise<boolean>;
  getAllActiveEmployees(): Promise<EmployeeType[]>;
}