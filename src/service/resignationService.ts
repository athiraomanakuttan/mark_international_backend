import { ResignationRepository } from '../repository/resignationRepository';
import { IResignationService } from './interface/IResignationService';
import { 
  ResignationBasicType, 
  ResignationType, 
  ResignationFilterType, 
  ResignationResponseType,
  ApproveRejectResignationType,
  ResignationStatsType,
  UpdateResignationType
} from '../types/resignationTypes';
import { BasicResponse } from '../types/basicResponse';
import { MESSAGE_CONST } from '../constant/MessageConst';

export class ResignationService implements IResignationService {
  private resignationRepository: ResignationRepository;

  constructor() {
    this.resignationRepository = new ResignationRepository();
  }

  async createResignation(resignationData: ResignationBasicType): Promise<BasicResponse<ResignationType>> {
    try {
      // Check if staff already has a pending resignation
      const existingResignations = await this.resignationRepository.getResignationsByStaffId(String(resignationData.staffId));
      const hasPendingResignation = existingResignations.some(resignation => resignation.status === 0);
      
      if (hasPendingResignation) {
        return {
          status: false,
          message: 'You already have a pending resignation request',
          data: {} as ResignationType,
        };
      }

      const resignation = await this.resignationRepository.createResignation(resignationData);
      
      return {
        status: true,
        message: MESSAGE_CONST.RESIGNATION_CREATED_SUCCESS,
        data: resignation,
      };
    } catch (error) {
      return {
        status: false,
        message: MESSAGE_CONST.INTERNAL_SERVER_ERROR,
        data: {} as ResignationType,
      };
    }
  }

  async getResignationById(resignationId: string): Promise<BasicResponse<ResignationType>> {
    try {
      const resignation = await this.resignationRepository.getResignationById(resignationId);
      
      if (!resignation) {
        return {
          status: false,
          message: MESSAGE_CONST.RESIGNATION_NOT_FOUND,
          data: {} as ResignationType,
        };
      }

      return {
        status: true,
        message: MESSAGE_CONST.RESIGNATION_FETCHED_SUCCESS,
        data: resignation,
      };
    } catch (error) {
      return {
        status: false,
        message: MESSAGE_CONST.INTERNAL_SERVER_ERROR,
        data: {} as ResignationType,
      };
    }
  }

  async getResignationsByStaffId(staffId: string): Promise<BasicResponse<ResignationType[]>> {
    try {
      const resignations = await this.resignationRepository.getResignationsByStaffId(staffId);
      
      return {
        status: true,
        message: MESSAGE_CONST.RESIGNATIONS_FETCHED_SUCCESS,
        data: resignations,
      };
    } catch (error) {
      return {
        status: false,
        message: MESSAGE_CONST.INTERNAL_SERVER_ERROR,
        data: [],
      };
    }
  }

  async getResignations(page: number = 1, limit: number = 10, status?: number, search: string = ''): Promise<BasicResponse<ResignationResponseType | null>> {
    try {
      const response = await this.resignationRepository.getResignations(page, limit, status, search);
      
      return {
        status: true,
        message: MESSAGE_CONST.RESIGNATIONS_FETCHED_SUCCESS,
        data: response,
      };
    } catch (error) {
      return {
        status: false,
        message: MESSAGE_CONST.INTERNAL_SERVER_ERROR,
        data: { resignations: [], totalRecords: 0 },
      };
    }
  }

  async updateResignation(resignationId: string, resignationData: UpdateResignationType, staffId?: string): Promise<BasicResponse<ResignationType>> {
    try {
      console.log('🔄 Service: updateResignation called', { resignationId, resignationData, staffId });
      
      // Check if resignation exists
      const existingResignation = await this.resignationRepository.getResignationById(resignationId);
      if (!existingResignation) {
        console.error('❌ Service: Resignation not found');
        return {
          status: false,
          message: MESSAGE_CONST.RESIGNATION_NOT_FOUND,
          data: {} as ResignationType,
        };
      }

      console.log('📋 Service: Existing resignation found', { status: existingResignation.status });

      // Only allow updates if resignation is still pending
      if (existingResignation.status !== 0) {
        console.error('❌ Service: Resignation already processed');
        return {
          status: false,
          message: 'Cannot update resignation that is already processed',
          data: {} as ResignationType,
        };
      }

      // If updating via staff, check if they have another pending resignation (excluding current one)
      if (staffId) {
        const existingResignations = await this.resignationRepository.getResignationsByStaffId(staffId);
        console.log('📊 Service: Staff resignations count', existingResignations.length);
        
        const hasPendingResignation = existingResignations.some(
          resignation => resignation.status === 0 && resignation._id.toString() !== resignationId
        );
        
        if (hasPendingResignation) {
          console.error('❌ Service: Another pending resignation exists');
          return {
            status: false,
            message: 'You already have another pending resignation request',
            data: {} as ResignationType,
          };
        }
      }

      console.log('✅ Service: Proceeding with update');
      const updatedResignation = await this.resignationRepository.updateResignation(resignationId, resignationData);
      
      return {
        status: true,
        message: MESSAGE_CONST.RESIGNATION_UPDATED_SUCCESS,
        data: updatedResignation!,
      };
    } catch (error) {
      console.error('❌ Service: Error in updateResignation:', error);
      return {
        status: false,
        message: MESSAGE_CONST.INTERNAL_SERVER_ERROR,
        data: {} as ResignationType,
      };
    }
  }

  async approveResignation(resignationId: string, adminId: string, adminComments?: string): Promise<BasicResponse<ResignationType>> {
    try {
      const updateData: ApproveRejectResignationType = {
        status: 1,
        adminId,
        adminComments
      };

      const resignation = await this.resignationRepository.approveOrRejectResignation(resignationId, updateData);
      
      if (!resignation) {
        return {
          status: false,
          message: MESSAGE_CONST.RESIGNATION_NOT_FOUND,
          data: {} as ResignationType,
        };
      }

      return {
        status: true,
        message: MESSAGE_CONST.RESIGNATION_APPROVED_SUCCESS,
        data: resignation,
      };
    } catch (error) {
      return {
        status: false,
        message: MESSAGE_CONST.INTERNAL_SERVER_ERROR,
        data: {} as ResignationType,
      };
    }
  }

  async rejectResignation(resignationId: string, adminId: string, adminComments?: string): Promise<BasicResponse<ResignationType>> {
    try {
      const updateData: ApproveRejectResignationType = {
        status: 2,
        adminId,
        adminComments
      };

      const resignation = await this.resignationRepository.approveOrRejectResignation(resignationId, updateData);
      
      if (!resignation) {
        return {
          status: false,
          message: MESSAGE_CONST.RESIGNATION_NOT_FOUND,
          data: {} as ResignationType,
        };
      }

      return {
        status: true,
        message: MESSAGE_CONST.RESIGNATION_REJECTED_SUCCESS,
        data: resignation,
      };
    } catch (error) {
      return {
        status: false,
        message: MESSAGE_CONST.INTERNAL_SERVER_ERROR,
        data: {} as ResignationType,
      };
    }
  }

  async deleteResignation(resignationId: string): Promise<BasicResponse<boolean>> {
    try {
      const result = await this.resignationRepository.deleteResignation(resignationId);
      
      if (!result) {
        return {
          status: false,
          message: MESSAGE_CONST.RESIGNATION_NOT_FOUND,
          data: false,
        };
      }

      return {
        status: true,
        message: MESSAGE_CONST.RESIGNATION_DELETED_SUCCESS,
        data: result,
      };
    } catch (error) {
      return {
        status: false,
        message: MESSAGE_CONST.INTERNAL_SERVER_ERROR,
        data: false,
      };
    }
  }

  async getResignationStats(): Promise<BasicResponse<ResignationStatsType>> {
    try {
      const stats = await this.resignationRepository.getResignationStats();
      
      return {
        status: true,
        message: 'Resignation statistics fetched successfully',
        data: stats,
      };
    } catch (error) {
      return {
        status: false,
        message: MESSAGE_CONST.INTERNAL_SERVER_ERROR,
        data: { pending: 0, approved: 0, rejected: 0, total: 0 },
      };
    }
  }
}