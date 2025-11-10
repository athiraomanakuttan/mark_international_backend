import { Response } from 'express';
import { CustomRequestType } from '../../types/requestType';
import { TerminationService } from '../../service/terminationService';
import { STATUS_CODE } from '../../constance/statusCode';
import { CreateTerminationRequest, TerminationFilterType } from '../../types/terminationTypes';

export class AdminTerminationController {
  private terminationService: TerminationService;

  constructor() {
    this.terminationService = new TerminationService();
  }

  // Get all terminations with filters
  getTerminations = async (req: CustomRequestType, res: Response): Promise<void> => {
    try {
      const {
        page = 1,
        limit = 10,
        search = '',
        type,
      } = req.query;

      const filter: TerminationFilterType = {};
      
      if (type && (type === 'staff' || type === 'employee')) {
        filter.type = type as 'staff' | 'employee';
      }
      
      if (search && typeof search === 'string' && search.trim()) {
        filter.search = search.trim();
      }

      const result = await this.terminationService.getTerminations(
        Number(page),
        Number(limit),
        filter
      );

      if (result.status) {
        res.status(STATUS_CODE.OK).json(result);
      } else {
        res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json(result);
      }
    } catch (error) {
      console.error('❌ Error in getTerminations:', error);
      res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
        status: false,
        message: 'Internal server error',
        data: null,
      });
    }
  };

  // Get termination by ID
  getTerminationById = async (req: CustomRequestType, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(STATUS_CODE.BAD_REQUEST).json({
          status: false,
          message: 'Termination ID is required',
          data: null,
        });
        return;
      }

      const result = await this.terminationService.getTerminationById(id);

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

  // Create new termination
  createTermination = async (req: CustomRequestType, res: Response): Promise<void> => {
    try {
      const adminId = req.user?.id;

      if (!adminId) {
        res.status(STATUS_CODE.UNAUTHORIZED).json({
          status: false,
          message: 'Admin not authenticated',
          data: null,
        });
        return;
      }

      const { type, personId, reason } = req.body as CreateTerminationRequest;

      if (!type || !personId || !reason) {
        res.status(STATUS_CODE.BAD_REQUEST).json({
          status: false,
          message: 'Type, person ID, and reason are required',
          data: null,
        });
        return;
      }

      if (type !== 'staff' && type !== 'employee') {
        res.status(STATUS_CODE.BAD_REQUEST).json({
          status: false,
          message: 'Type must be either "staff" or "employee"',
          data: null,
        });
        return;
      }

      if (reason.trim().length < 10) {
        res.status(STATUS_CODE.BAD_REQUEST).json({
          status: false,
          message: 'Reason must be at least 10 characters',
          data: null,
        });
        return;
      }

      const result = await this.terminationService.createTermination(
        { type, personId, reason: reason.trim() },
        adminId
      );

      if (result.status) {
        res.status(STATUS_CODE.CREATED).json(result);
      } else {
        res.status(STATUS_CODE.BAD_REQUEST).json(result);
      }
    } catch (error) {
      console.error('❌ Error in createTermination:', error);
      res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
        status: false,
        message: 'Internal server error',
        data: null,
      });
    }
  };

  // Get active staff list
  getActiveStaff = async (req: CustomRequestType, res: Response): Promise<void> => {
    try {
      const result = await this.terminationService.getActiveStaff();

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

  // Get active employees list
  getActiveEmployees = async (req: CustomRequestType, res: Response): Promise<void> => {
    try {
      const result = await this.terminationService.getActiveEmployees();

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
}
