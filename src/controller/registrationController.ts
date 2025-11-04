import { Request, Response } from 'express';
import { IRegistrationService } from '../service/interface/IRegistrationService';
import { STATUS_CODE } from '../constance/statusCode';
import { MESSAGE_CONST } from '../constant/MessageConst';
import { CreateRegistrationDto } from '../types/registrationTypes';

export class RegistrationController {
  private __registrationService: IRegistrationService;

  constructor(registrationService: IRegistrationService) {
    this.__registrationService = registrationService;
  }

  async createRegistration(req: Request, res: Response): Promise<void> {
    try {
      // Extract form data from request body
      // Support two shapes for address:
      // 1) separate fields: street, city, state, pincode, country
      // 2) single JSON string field: address = '{"street":"...","city":"..."}'
      let parsedAddress: any = {};
      if (req.body && req.body.address) {
        const addrField = req.body.address;
        if (typeof addrField === 'string') {
          try {
            parsedAddress = JSON.parse(addrField);
          } catch (err) {
            // ignore parse errors and leave parsedAddress empty
            parsedAddress = {};
          }
        } else if (typeof addrField === 'object') {
          parsedAddress = addrField;
        }
      }

      const registrationData: CreateRegistrationDto = {
        name: req.body.name,
        dateOfBirth: req.body.dateOfBirth,
        contactNumber: req.body.contactNumber,
        maritalStatus: req.body.maritalStatus,
        street: parsedAddress.street || req.body.street,
        city: parsedAddress.city || req.body.city,
        state: parsedAddress.state || req.body.state,
        pincode: parsedAddress.pincode ? String(parsedAddress.pincode) : req.body.pincode,
        country: parsedAddress.country || req.body.country
      };

      // Extract uploaded files and keep only those that belong to documents
      // (this accepts nested field names from the client like "documents[0][file]")
      const allFiles = req.files as Express.Multer.File[] | undefined;
      const files = (allFiles || []).filter(f => typeof f.fieldname === 'string' && f.fieldname.includes('documents'));

      // Validate that files are provided
      if (!files || files.length === 0) {
        res.status(STATUS_CODE.BAD_REQUEST).json({
          success: false,
          message: 'At least one document is required'
        });
        return;
      }

      // Create registration using service
      const result = await this.__registrationService.createRegistration(registrationData, files);

      if (result.success) {
        res.status(STATUS_CODE.CREATED).json(result);
      } else {
        res.status(STATUS_CODE.BAD_REQUEST).json(result);
      }
    } catch (error) {
      console.error('Registration creation error:', error);
      res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: MESSAGE_CONST.INTERNAL_SERVER_ERROR
      });
    }
  }

  async getRegistrationById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      if (!id) {
        res.status(STATUS_CODE.BAD_REQUEST).json({
          success: false,
          message: 'Registration ID is required'
        });
        return;
      }

      const registration = await this.__registrationService.getRegistrationById(id);

      if (registration) {
        res.status(STATUS_CODE.OK).json({
          success: true,
          message: 'Registration found',
          data: registration
        });
      } else {
        res.status(STATUS_CODE.NOT_FOUND).json({
          success: false,
          message: 'Registration not found'
        });
      }
    } catch (error) {
      console.error('Get registration error:', error);
      res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: MESSAGE_CONST.INTERNAL_SERVER_ERROR
      });
    }
  }

  async getAllRegistrations(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await this.__registrationService.getAllRegistrations(page, limit);

      res.status(STATUS_CODE.OK).json({
        success: true,
        message: 'Registrations retrieved successfully',
        data: result.registrations,
        pagination: {
          page,
          limit,
          total: result.total,
          totalPages: Math.ceil(result.total / limit)
        }
      });
    } catch (error) {
      console.error('Get all registrations error:', error);
      res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: MESSAGE_CONST.INTERNAL_SERVER_ERROR
      });
    }
  }

  async updateRegistrationStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!id) {
        res.status(STATUS_CODE.BAD_REQUEST).json({
          success: false,
          message: 'Registration ID is required'
        });
        return;
      }

      if (![1, 2, 3].includes(status)) {
        res.status(STATUS_CODE.BAD_REQUEST).json({
          success: false,
          message: 'Invalid status. Must be 1 (pending), 2 (approved), or 3 (rejected)'
        });
        return;
      }

      const updatedRegistration = await this.__registrationService.updateRegistration(id, { status });

      if (updatedRegistration) {
        res.status(STATUS_CODE.OK).json({
          success: true,
          message: 'Registration status updated successfully',
          data: updatedRegistration
        });
      } else {
        res.status(STATUS_CODE.NOT_FOUND).json({
          success: false,
          message: 'Registration not found'
        });
      }
    } catch (error) {
      console.error('Update registration status error:', error);
      res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: MESSAGE_CONST.INTERNAL_SERVER_ERROR
      });
    }
  }

  async deleteRegistration(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(STATUS_CODE.BAD_REQUEST).json({
          success: false,
          message: 'Registration ID is required'
        });
        return;
      }

      const deleted = await this.__registrationService.deleteRegistration(id);

      if (deleted) {
        res.status(STATUS_CODE.OK).json({
          success: true,
          message: 'Registration deleted successfully'
        });
      } else {
        res.status(STATUS_CODE.NOT_FOUND).json({
          success: false,
          message: 'Registration not found'
        });
      }
    } catch (error) {
      console.error('Delete registration error:', error);
      res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: MESSAGE_CONST.INTERNAL_SERVER_ERROR
      });
    }
  }
}