import { TerminationRepository } from '../repository/terminationRepository';
import {
  CreateTerminationRequest,
  TerminationFilterType,
  TerminationResponse,
  TerminationListResponseType,
  StaffEmployeeListResponse
} from '../types/terminationTypes';

export class TerminationService {
  private terminationRepository: TerminationRepository;

  constructor() {
    this.terminationRepository = new TerminationRepository();
  }

  async createTermination(
    requestData: CreateTerminationRequest,
    adminId: string
  ): Promise<TerminationResponse> {
    try {
      // Get person details to store name
      let personName = '';
      
      if (requestData.type === 'staff') {
        const staffList = await this.terminationRepository.getActiveStaff();
        const staff = staffList.find(s => s._id === requestData.personId);
        if (!staff) {
          return {
            status: false,
            message: 'Staff member not found',
            data: null as any
          };
        }
        personName = staff.name;
      } else {
        const employeeList = await this.terminationRepository.getActiveEmployees();
        const employee = employeeList.find(e => e._id === requestData.personId);
        if (!employee) {
          return {
            status: false,
            message: 'Employee not found',
            data: null as any
          };
        }
        personName = employee.name;
      }

      // Create termination record
      const termination = await this.terminationRepository.createTermination({
        type: requestData.type,
        personId: requestData.personId,
        personName,
        reason: requestData.reason,
        terminatedBy: adminId
      });

      // Disable the staff or employee
      if (requestData.type === 'staff') {
        await this.terminationRepository.disableStaff(requestData.personId);
      } else {
        await this.terminationRepository.disableEmployee(requestData.personId);
      }

      return {
        status: true,
        message: `${requestData.type === 'staff' ? 'Staff member' : 'Employee'} terminated successfully`,
        data: termination
      };
    } catch (error: any) {
      return {
        status: false,
        message: error.message || 'Failed to terminate',
        data: null as any
      };
    }
  }

  async getTerminations(
    page: number = 1,
    limit: number = 10,
    filter: TerminationFilterType = {}
  ): Promise<TerminationListResponseType> {
    try {
      const result = await this.terminationRepository.getTerminations(page, limit, filter);

      return {
        status: true,
        message: 'Terminations fetched successfully',
        data: result
      };
    } catch (error: any) {
      return {
        status: false,
        message: error.message || 'Failed to fetch terminations',
        data: null as any
      };
    }
  }

  async getTerminationById(terminationId: string): Promise<TerminationResponse> {
    try {
      const termination = await this.terminationRepository.getTerminationById(terminationId);

      if (!termination) {
        return {
          status: false,
          message: 'Termination not found',
          data: null as any
        };
      }

      return {
        status: true,
        message: 'Termination fetched successfully',
        data: termination
      };
    } catch (error: any) {
      return {
        status: false,
        message: error.message || 'Failed to fetch termination',
        data: null as any
      };
    }
  }

  async getActiveStaff(): Promise<StaffEmployeeListResponse> {
    try {
      const staff = await this.terminationRepository.getActiveStaff();

      return {
        status: true,
        message: 'Active staff fetched successfully',
        data: staff
      };
    } catch (error: any) {
      return {
        status: false,
        message: error.message || 'Failed to fetch active staff',
        data: null as any
      };
    }
  }

  async getActiveEmployees(): Promise<StaffEmployeeListResponse> {
    try {
      const employees = await this.terminationRepository.getActiveEmployees();

      return {
        status: true,
        message: 'Active employees fetched successfully',
        data: employees
      };
    } catch (error: any) {
      return {
        status: false,
        message: error.message || 'Failed to fetch active employees',
        data: null as any
      };
    }
  }
}
