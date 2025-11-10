import { Response } from 'express';
import { CustomRequestType } from '../../types/requestType';
import { ResignationService } from '../../service/resignationService';
import { ResignationFilterType } from '../../types/resignationTypes';
import { STATUS_CODE } from '../../constance/statusCode';
import { resignationsMapper, resignationDtoMapper } from '../../dto/dtoMapper/resignationDtoMapper';

export class AdminResignationController {
  private resignationService: ResignationService;

  constructor() {
    this.resignationService = new ResignationService();
  }

  // Get all resignations with filters
  getResignations = async (req: CustomRequestType, res: Response): Promise<void> => {
    try {
      const {
        page = 1,
        limit = 10,
        search = '',
        status,
      } = req.query;

      console.log('📋 Admin controller: getResignations called with:', { page, limit, search, status });

      const result = await this.resignationService.getResignations(
        Number(page),
        Number(limit),
        status !== undefined ? Number(status) : 0,
        search as string
      );

      if (result.status && result.data) {
        // Use DTO mapper to format response
        const formattedResignations = resignationsMapper(result.data.resignations);

        res.status(STATUS_CODE.OK).json({
          status: true,
          message: result.message,
          data: {
            resignations: formattedResignations,
            totalRecords: result.data.totalRecords
          }
        });
      } else {
        res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json(result);
      }
    } catch (error) {
      console.error('❌ Error in getResignations:', error);
      res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
        status: false,
        message: 'Internal server error',
        data: null,
      });
    }
  };

  // Get resignations by status
  getResignationsByStatus = async (req: CustomRequestType, res: Response): Promise<void> => {
    try {
      const { status } = req.params;
      const {
        page = 1,
        limit = 10,
        search = ''
      } = req.query;

      if (!status || !['0', '1', '2'].includes(status)) {
        res.status(STATUS_CODE.BAD_REQUEST).json({
          status: false,
          message: 'Valid status is required (0: Pending, 1: Approved, 2: Rejected)',
          data: null,
        });
        return;
      }

      const filterData: ResignationFilterType = {
        status: Number(status)
      };

      const result = await this.resignationService.getResignations(
        Number(page),
        Number(limit),
        Number(status),
        search as string
      );

      if (result.status) {
        res.status(STATUS_CODE.OK).json(result);
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

  // Get resignation by ID
  getResignationById = async (req: CustomRequestType, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

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
        // Use DTO mapper to format response
        const formattedResignation = resignationDtoMapper(result.data);

        res.status(STATUS_CODE.OK).json({
          status: result.status,
          message: result.message,
          data: formattedResignation
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

  // Approve resignation
  approveResignation = async (req: CustomRequestType, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { adminComments } = req.body;
      const adminId = req.user?.id; // From authentication middleware

      if (!adminId) {
        res.status(STATUS_CODE.UNAUTHORIZED).json({
          status: false,
          message: 'Admin not authenticated',
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

      const result = await this.resignationService.approveResignation(id, adminId, adminComments);

      if (result.status) {
        // Use DTO mapper to format response
        const formattedResignation = resignationDtoMapper(result.data);

        res.status(STATUS_CODE.OK).json({
          status: result.status,
          message: result.message,
          data: formattedResignation
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

  // Reject resignation
  rejectResignation = async (req: CustomRequestType, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { adminComments } = req.body;
      const adminId = req.user?.id; // From authentication middleware

      if (!adminId) {
        res.status(STATUS_CODE.UNAUTHORIZED).json({
          status: false,
          message: 'Admin not authenticated',
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

      const result = await this.resignationService.rejectResignation(id, adminId, adminComments);

      if (result.status) {
        // Use DTO mapper to format response
        const formattedResignation = resignationDtoMapper(result.data);

        res.status(STATUS_CODE.OK).json({
          status: result.status,
          message: result.message,
          data: formattedResignation
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

  // Get resignation statistics
  getResignationStats = async (req: CustomRequestType, res: Response): Promise<void> => {
    try {
      const result = await this.resignationService.getResignationStats();

      if (result.status) {
        res.status(STATUS_CODE.OK).json(result);
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

  // Delete resignation (admin only - for cleanup purposes)
  deleteResignation = async (req: CustomRequestType, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(STATUS_CODE.BAD_REQUEST).json({
          status: false,
          message: 'Resignation ID is required',
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

  // Review resignation (approve/reject) - matches frontend API expectation
  reviewResignation = async (req: CustomRequestType, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { status, adminComments, comments } = req.body;
      const adminId = req.user?.id; // From authentication middleware

      // Accept both 'comments' and 'adminComments' for compatibility
      const finalComments = adminComments || comments;

      if (!adminId) {
        res.status(STATUS_CODE.UNAUTHORIZED).json({
          status: false,
          message: 'Admin not authenticated',
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

      if (status !== 1 && status !== 2) {
        res.status(STATUS_CODE.BAD_REQUEST).json({
          status: false,
          message: 'Status must be 1 (approved) or 2 (rejected)',
          data: null,
        });
        return;
      }

      let result;
      if (status === 1) {
        result = await this.resignationService.approveResignation(id, adminId, finalComments);
      } else {
        result = await this.resignationService.rejectResignation(id, adminId, finalComments);
      }

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