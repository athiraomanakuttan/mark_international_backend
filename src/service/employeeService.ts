import { IEmployeeRepository } from '../repository/interface/IEmployeeRepository';
import { IEmployeeService } from './interface/IEmployeeService';
import { EmployeeBasicType, UpdateEmployeeType, EmployeeFilterType } from '../types/employeeTypes';
import { EmployeeDto } from '../dto/dtoTypes/employeeDto';
import { employeeDtoMapper, employeesMapper } from '../dto/dtoMapper/employeeDtoMapper';

export class EmployeeService implements IEmployeeService {
  private __employeeRepository: IEmployeeRepository;

  constructor(employeeRepository: IEmployeeRepository) {
    this.__employeeRepository = employeeRepository;
  }

  async createEmployee(employeeData: EmployeeBasicType): Promise<EmployeeDto> {
    try {
      // Check if email already exists
      console.log('Creating employee with email:');
      const emailExists = await this.__employeeRepository.checkEmailExists(employeeData.email);
      if (emailExists) {
        throw new Error('Email already exists');
      }

      const employee = await this.__employeeRepository.createEmployee(employeeData);
      return employeeDtoMapper(employee);
    } catch (error) {
      throw error;
    }
  }

  async getEmployees(page: number = 1, limit: number = 10, filterData: EmployeeFilterType, search: string = ''): Promise<{ employees: EmployeeDto[], totalRecords: number }> {
    try {
      const response = await this.__employeeRepository.getEmployees(page, limit, filterData, search);
      const employees = employeesMapper(response.employees);
      return {
        employees,
        totalRecords: response.totalRecords
      };
    } catch (error) {
      throw error;
    }
  }

  async getEmployeeById(employeeId: string): Promise<EmployeeDto | null> {
    try {
      const employee = await this.__employeeRepository.getEmployeeById(employeeId);
      if (!employee) {
        return null;
      }
      return employeeDtoMapper(employee);
    } catch (error) {
      throw error;
    }
  }

  async updateEmployee(employeeId: string, employeeData: UpdateEmployeeType): Promise<EmployeeDto | null> {
    try {


      // Check if updating email and it already exists (excluding current employee)
      if (employeeData.email) {
        const emailExists = await this.__employeeRepository.checkEmailExists(employeeData.email, employeeId);
        if (emailExists) {
          throw new Error('Email already exists');
        }
      }

      const employee = await this.__employeeRepository.updateEmployee(employeeId, employeeData);
      if (!employee) {
        return null;
      }
      return employeeDtoMapper(employee);
    } catch (error) {
      throw error;
    }
  }

  async deleteEmployee(employeeId: string): Promise<boolean> {
    try {
      return await this.__employeeRepository.deleteEmployee(employeeId);
    } catch (error) {
      throw error;
    }
  }

  async getAllActiveEmployees(): Promise<EmployeeDto[]> {
    try {
      const employees = await this.__employeeRepository.getAllActiveEmployees();
      return employeesMapper(employees);
    } catch (error) {
      throw error;
    }
  }
}