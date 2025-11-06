import { EmployeeType } from '../../types/employeeTypes';
import { formatDate } from '../../utils/formatDate';
import { EmployeeDto } from '../dtoTypes/employeeDto';

export const employeeDtoMapper = (employee: EmployeeType): EmployeeDto => {
  return {
    id: employee._id,
    name: employee.name,
    email: employee.email,
    phoneNumber: employee.phoneNumber,
    designation: employee?.designationData?.[0]?.name || '',
    designationId: employee?.designationData?.[0]?._id || employee.designation,
    dateOfJoining: formatDate(employee.dateOfJoining),
    profilePicture: employee.profilePicture || '',
    address: employee.address || '',
    status: employee.status,
    createdAt: formatDate(employee.createdAt),
    updatedAt: formatDate(employee.updatedAt),
    createdById: employee?.createdByData?.[0]?._id || '',
    createdByName: employee?.createdByData?.[0]?.name || '',
  };
};

export const employeesMapper = (employees: EmployeeType[]) => {
  return employees.map((employee) => employeeDtoMapper(employee));
};