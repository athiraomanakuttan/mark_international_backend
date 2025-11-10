import { Response } from 'express';
import { CustomRequestType } from '../../types/requestType';
import { ResignationService } from '../../service/resignationService';
import { ResignationBasicType, UpdateResignationType } from '../../types/resignationTypes';
import mongoose from 'mongoose';
import { STATUS_CODE } from '../../constance/statusCode';

export class StaffResignationController {
  private resignationService: ResignationService;

  constructor() {
    this.resignationService = new ResignationService();
  }

  // Create a new resignation
  createResignation = async (req: CustomRequestType, res: Response): Promise<void> => {
    try {
      const { reason } = req.body;
      const staffId = req.user?.id; // From authentication middleware
      const document = req.file?.path; // From multer/cloudinary middleware (document field)

      if (!staffId) {
        res.status(STATUS_CODE.UNAUTHORIZED).json({
          status: false,
          message: 'User not authenticated',
          data: null,
        });
        return;
      }

      if (!reason) {
        res.status(STATUS_CODE.BAD_REQUEST).json({
          status: false,
          message: 'Reason is required',
          data: null,
        });
        return;
      }

      const resignationData: ResignationBasicType = {
        staffId: new mongoose.Types.ObjectId(staffId),
        reason,
        document: document || '',
      };

      const result = await this.resignationService.createResignation(resignationData);

      if (result.status) {
        // Map _id to id for frontend compatibility
        const formattedResignation = {
          ...result.data,
          id: result.data._id.toString(),
          employeeId: result.data.staffId.toString(),
          employeeName: result.data.staffData?.[0]?.name || 'Unknown',
          reviewedBy: result.data.approvedBy?.toString() || result.data.rejectedBy?.toString(),
          reviewerName: result.data.approvedByData?.[0]?.name || result.data.rejectedByData?.[0]?.name,
          comments: result.data.adminComments,
          reviewedAt: result.data.status !== 0 ? result.data.updatedAt : undefined,
        };

        res.status(STATUS_CODE.CREATED).json({
          status: result.status,
          message: result.message,
          data: formattedResignation,
        });
      } else {
        res.status(STATUS_CODE.BAD_REQUEST).json(result);
      }
    } catch (error) {
      res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
        status: false,
        message: 'Internal server error',
        data: null,
      });
    }
  };

  // Get resignation by ID
  getResignationById = async (req: CustomRequestType, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const staffId = req.user?.id; // From authentication middleware

      if (!staffId) {
        res.status(STATUS_CODE.UNAUTHORIZED).json({
          status: false,
          message: 'User not authenticated',
          data: null,
        });
        return;
      }

      if (!id) {
        res.status(STATUS_CODE.BAD_REQUEST).json({
          status: false,
          message: 'Resignation ID is required',
          data: null,
        });
        return;
      }

      const result = await this.resignationService.getResignationById(id);

      if (result.status) {
        // Check if the resignation belongs to the current staff member
        if (result.data.staffId.toString() !== staffId) {
          res.status(STATUS_CODE.UNAUTHORIZED).json({
            status: false,
            message: 'You can only view your own resignations',
            data: null,
          });
          return;
        }

        // Map _id to id for frontend compatibility
        const formattedResignation = {
          ...result.data,
          id: result.data._id.toString(),
          employeeId: result.data.staffId.toString(),
          employeeName: result.data.staffData?.[0]?.name || 'Unknown',
          reviewedBy: result.data.approvedBy?.toString() || result.data.rejectedBy?.toString(),
          reviewerName: result.data.approvedByData?.[0]?.name || result.data.rejectedByData?.[0]?.name,
          comments: result.data.adminComments,
          reviewedAt: result.data.status !== 0 ? result.data.updatedAt : undefined,
        };

        res.status(STATUS_CODE.OK).json({
          status: result.status,
          message: result.message,
          data: formattedResignation,
        });
      } else {
        res.status(STATUS_CODE.NOT_FOUND).json(result);
      }
    } catch (error) {
      res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
        status: false,
        message: 'Internal server error',
        data: null,
      });
    }
  };

  // Get user's resignation (returns latest resignation or null if none exists)
  getMyResignations = async (req: CustomRequestType, res: Response): Promise<void> => {
    try {
      const staffId = req.user?.id; // From authentication middleware

      if (!staffId) {
        res.status(STATUS_CODE.UNAUTHORIZED).json({
          status: false,
          message: 'User not authenticated',
          data: null,
        });
        return;
      }

      const result = await this.resignationService.getResignationsByStaffId(staffId);

      if (result.status) {
        // Return the latest resignation (first in array since they're sorted by createdAt desc)
        // If no resignations exist, return null
        const latestResignation = result.data.length > 0 ? result.data[0] : null;
        
        if (!latestResignation) {
          res.status(STATUS_CODE.NOT_FOUND).json({
            status: false,
            message: 'No resignation found',
            data: null,
          });
          return;
        }

        // Map _id to id for frontend compatibility
        const formattedResignation = {
          ...latestResignation,
          id: latestResignation._id.toString(),
          employeeId: latestResignation.staffId.toString(),
          employeeName: latestResignation.staffData?.[0]?.name || 'Unknown',
          reviewedBy: latestResignation.approvedBy?.toString() || latestResignation.rejectedBy?.toString(),
          reviewerName: latestResignation.approvedByData?.[0]?.name || latestResignation.rejectedByData?.[0]?.name,
          comments: latestResignation.adminComments,
          reviewedAt: latestResignation.status !== 0 ? latestResignation.updatedAt : undefined,
        };

        res.status(STATUS_CODE.OK).json({
          status: true,
          message: result.message,
          data: formattedResignation,
        });
      } else {
        res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json(result);
      }
    } catch (error) {
      res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
        status: false,
        message: 'Internal server error',
        data: null,
      });
    }
  };

  // Update resignation (only if pending)
  updateResignation = async (req: CustomRequestType, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      const staffId = req.user?.id; // From authentication middleware
      const document = req.file?.path; // From multer/cloudinary middleware

      console.log('📝 Update Resignation Request:', { id, reason, staffId, document });

      if (!staffId) {
        res.status(STATUS_CODE.UNAUTHORIZED).json({
          status: false,
          message: 'User not authenticated',
          data: null,
        });
        return;
      }

      if (!id) {
        res.status(STATUS_CODE.BAD_REQUEST).json({
          status: false,
          message: 'Resignation ID is required',
          data: null,
        });
        return;
      }

      // First check if the resignation exists and belongs to the staff member
      const existingResignation = await this.resignationService.getResignationById(id);
      if (!existingResignation.status) {
        console.error('❌ Resignation not found:', id);
        res.status(STATUS_CODE.NOT_FOUND).json(existingResignation);
        return;
      }

      console.log('📋 Existing resignation data:', {
        resignationId: existingResignation.data._id,
        staffId: existingResignation.data.staffId,
        currentUserId: staffId,
        staffIdType: typeof existingResignation.data.staffId,
        currentUserIdType: typeof staffId
      });

      const resignationStaffId = existingResignation.data.staffId?.toString() || existingResignation.data.staffId;
      
      if (resignationStaffId !== staffId) {
        console.error('❌ Unauthorized: Resignation belongs to different user', {
          resignationStaffId,
          requestingStaffId: staffId
        });
        res.status(STATUS_CODE.UNAUTHORIZED).json({
          status: false,
          message: 'You can only update your own resignations',
          data: null,
        });
        return;
      }

      const updateData: UpdateResignationType = {};
      if (reason) updateData.reason = reason;
      if (document) updateData.document = document;

      console.log('📤 Sending update data:', updateData);

      const result = await this.resignationService.updateResignation(id, updateData, staffId);

      if (result.status) {
        
        // Map _id to id for frontend compatibility
        const formattedResignation = {
          ...result.data,
          id: result.data._id.toString(),
          employeeId: result.data.staffId.toString(),
          employeeName: result.data.staffData?.[0]?.name || 'Unknown',
          reviewedBy: result.data.approvedBy?.toString() || result.data.rejectedBy?.toString(),
          reviewerName: result.data.approvedByData?.[0]?.name || result.data.rejectedByData?.[0]?.name,
          comments: result.data.adminComments,
          reviewedAt: result.data.status !== 0 ? result.data.updatedAt : undefined,
        };

        res.status(STATUS_CODE.OK).json({
          status: result.status,
          message: result.message,
          data: formattedResignation,
        });
      } else {
        console.error('❌ Update failed:', result.message);
        res.status(STATUS_CODE.BAD_REQUEST).json(result);
      }
    } catch (error) {
      console.error('❌ Internal server error in updateResignation:', error);
      res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
        status: false,
        message: 'Internal server error',
        data: null,
      });
    }
  };

  // Delete resignation (only if pending)
  deleteResignation = async (req: CustomRequestType, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const staffId = req.user?.id; // From authentication middleware

      if (!staffId) {
        res.status(STATUS_CODE.UNAUTHORIZED).json({
          status: false,
          message: 'User not authenticated',
          data: null,
        });
        return;
      }

      if (!id) {
        res.status(STATUS_CODE.BAD_REQUEST).json({
          status: false,
          message: 'Resignation ID is required',
          data: null,
        });
        return;
      }

      // First check if the resignation exists and belongs to the staff member
      const existingResignation = await this.resignationService.getResignationById(id);
      if (!existingResignation.status) {
        res.status(STATUS_CODE.NOT_FOUND).json(existingResignation);
        return;
      }

      if (existingResignation.data.staffId.toString() !== staffId) {
        res.status(STATUS_CODE.UNAUTHORIZED).json({
          status: false,
          message: 'You can only delete your own resignations',
          data: null,
        });
        return;
      }

      // Only allow deletion if resignation is still pending
      if (existingResignation.data.status !== 0) {
        res.status(STATUS_CODE.BAD_REQUEST).json({
          status: false,
          message: 'Cannot delete resignation that is already processed',
          data: null,
        });
        return;
      }

      const result = await this.resignationService.deleteResignation(id);

      if (result.status) {
        res.status(STATUS_CODE.OK).json(result);
      } else {
        res.status(STATUS_CODE.NOT_FOUND).json(result);
      }
    } catch (error) {
      res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
        status: false,
        message: 'Internal server error',
        data: null,
      });
    }
  };
}