import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { STATUS_CODE } from '../../constance/statusCode';
import { MESSAGE_CONST } from '../../constant/MessageConst';
import { IDesignationService } from '../../service/interface/IDesignationService';
import { CustomRequestType } from '../../types/requestType';
import { DesignationBasicType, UpdateDesignationType, DesignationFilterType } from '../../types/designationTypes';

export class DesignationController {
  private __designationService: IDesignationService;

  constructor(designationService: IDesignationService) {
    this.__designationService = designationService;
  }

  async createDesignation(req: CustomRequestType, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(STATUS_CODE.UNAUTHORIZED).json({
          status: false,
          message: MESSAGE_CONST.UNAUTHORIZED
        });
        return;
      }

      const { name, description, status = 1 } = req.body;

      if (!name || !name.trim()) {
        res.status(STATUS_CODE.BAD_REQUEST).json({
          status: false,
          message: 'Designation name is required'
        });
        return;
      }

      const designationData: DesignationBasicType = {
        name: name.trim(),
        description: description?.trim() || '',
        status,
        createdBy: new mongoose.Types.ObjectId(userId)
      };

      const designation = await this.__designationService.createDesignation(designationData);

      res.status(STATUS_CODE.CREATED).json({
        status: true,
        message: 'Designation created successfully',
        data: designation
      });
    } catch (error: any) {
      if (error.message === 'Designation with this name already exists') {
        res.status(STATUS_CODE.BAD_REQUEST).json({
          status: false,
          message: error.message
        });
        return;
      }
      res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
        status: false,
        message: MESSAGE_CONST.INTERNAL_SERVER_ERROR
      });
    }
  }

  async getDesignations(req: Request, res: Response): Promise<void> {
    try {
      const {
        page = '1',
        limit = '10',
        filter = '{}',
        search = ''
      } = req.query as {
        page?: string;
        limit?: string;
        filter?: string;
        search?: string;
      };

      const filterData = JSON.parse(filter) as DesignationFilterType;
      const response = await this.__designationService.getDesignations(
        Number(page),
        Number(limit),
        filterData,
        search
      );

      res.status(STATUS_CODE.OK).json({
        status: true,
        message: 'Designations fetched successfully',
        data: response
      });
    } catch (error) {
      res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
        status: false,
        message: MESSAGE_CONST.INTERNAL_SERVER_ERROR
      });
    }
  }

  async getDesignationById(req: Request, res: Response): Promise<void> {
    try {
      const designationId = req.params.id;

      if (!designationId) {
        res.status(STATUS_CODE.BAD_REQUEST).json({
          status: false,
          message: 'Designation ID is required'
        });
        return;
      }

      const designation = await this.__designationService.getDesignationById(designationId);

      if (!designation) {
        res.status(STATUS_CODE.NOT_FOUND).json({
          status: false,
          message: 'Designation not found'
        });
        return;
      }

      res.status(STATUS_CODE.OK).json({
        status: true,
        message: 'Designation fetched successfully',
        data: designation
      });
    } catch (error) {
      res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
        status: false,
        message: MESSAGE_CONST.INTERNAL_SERVER_ERROR
      });
    }
  }

  async updateDesignation(req: CustomRequestType, res: Response): Promise<void> {
    try {
      const designationId = req.params.id;
      const userId = req.user?.id;

      if (!userId) {
        res.status(STATUS_CODE.UNAUTHORIZED).json({
          status: false,
          message: MESSAGE_CONST.UNAUTHORIZED
        });
        return;
      }

      if (!designationId) {
        res.status(STATUS_CODE.BAD_REQUEST).json({
          status: false,
          message: 'Designation ID is required'
        });
        return;
      }

      const updateData: UpdateDesignationType = {};

      if (req.body.name !== undefined) {
        if (!req.body.name.trim()) {
          res.status(STATUS_CODE.BAD_REQUEST).json({
            status: false,
            message: 'Designation name cannot be empty'
          });
          return;
        }
        updateData.name = req.body.name.trim();
      }

      if (req.body.description !== undefined) {
        updateData.description = req.body.description?.trim() || '';
      }

      if (req.body.status !== undefined) {
        updateData.status = req.body.status;
      }

      const designation = await this.__designationService.updateDesignation(designationId, updateData);

      if (!designation) {
        res.status(STATUS_CODE.NOT_FOUND).json({
          status: false,
          message: 'Designation not found'
        });
        return;
      }

      res.status(STATUS_CODE.OK).json({
        status: true,
        message: MESSAGE_CONST.UPDATION_SUCCESS,
        data: designation
      });
    } catch (error: any) {
      if (error.message === 'Designation with this name already exists') {
        res.status(STATUS_CODE.BAD_REQUEST).json({
          status: false,
          message: error.message
        });
        return;
      }
      res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
        status: false,
        message: MESSAGE_CONST.INTERNAL_SERVER_ERROR
      });
    }
  }

  async deleteDesignation(req: Request, res: Response): Promise<void> {
    try {
      const designationId = req.params.id;

      if (!designationId) {
        res.status(STATUS_CODE.BAD_REQUEST).json({
          status: false,
          message: 'Designation ID is required'
        });
        return;
      }

      const deleted = await this.__designationService.deleteDesignation(designationId);

      if (!deleted) {
        res.status(STATUS_CODE.NOT_FOUND).json({
          status: false,
          message: 'Designation not found'
        });
        return;
      }

      res.status(STATUS_CODE.OK).json({
        status: true,
        message: 'Designation deleted successfully'
      });
    } catch (error) {
      res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
        status: false,
        message: MESSAGE_CONST.INTERNAL_SERVER_ERROR
      });
    }
  }

  async getAllActiveDesignations(req: Request, res: Response): Promise<void> {
    try {
      const designations = await this.__designationService.getAllActiveDesignations();

      res.status(STATUS_CODE.OK).json({
        status: true,
        message: 'Active designations fetched successfully',
        data: designations
      });
    } catch (error) {
      res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
        status: false,
        message: MESSAGE_CONST.INTERNAL_SERVER_ERROR
      });
    }
  }
}