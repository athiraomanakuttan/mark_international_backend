import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { STATUS_CODE } from '../../constance/statusCode';
import { MESSAGE_CONST } from '../../constant/MessageConst';
import { IEmployeeService } from '../../service/interface/IEmployeeService';
import { CustomRequestType } from '../../types/requestType';
import { EmployeeBasicType, UpdateEmployeeType, EmployeeFilterType } from '../../types/employeeTypes';

export class EmployeeController {
  private __employeeService: IEmployeeService;

  constructor(employeeService: IEmployeeService) {
    this.__employeeService = employeeService;
  }

  async createEmployee(req: CustomRequestType, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(STATUS_CODE.UNAUTHORIZED).json({
          status: false,
          message: MESSAGE_CONST.UNAUTHORIZED
        });
        return;
      }

      const { 
        name, 
        email, 
        phoneNumber, 
        designation, 
        dateOfJoining, 
        address, 
        status = 1 
      } = req.body;
      console.log("name:", name);
      console.log("email:", email);
      console.log("phoneNumber:", phoneNumber);
      console.log("designation:", designation);
      console.log("dateOfJoining:", dateOfJoining);
      console.log("address:", address);
      console.log("status:", status);

      if (!name || !name.trim()) {
        res.status(STATUS_CODE.BAD_REQUEST).json({
          status: false,
          message: 'Employee name is required'
        });
        return;
      }

      if (!email || !email.trim()) {
        res.status(STATUS_CODE.BAD_REQUEST).json({
          status: false,
          message: 'Email is required'
        });
        return;
      }

      if (!phoneNumber || !phoneNumber.trim()) {
        res.status(STATUS_CODE.BAD_REQUEST).json({
          status: false,
          message: 'Phone number is required'
        });
        return;
      }

      if (!designation) {
        res.status(STATUS_CODE.BAD_REQUEST).json({
          status: false,
          message: 'Designation is required'
        });
        return;
      }

      const employeeData: EmployeeBasicType = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phoneNumber: phoneNumber.trim(),
        designation: new mongoose.Types.ObjectId(designation),
        dateOfJoining: dateOfJoining ? new Date(dateOfJoining) : new Date(),
        profilePicture: req.file ? req.file.path : '',
        address: address?.trim() || '',
        status,
        createdBy: new mongoose.Types.ObjectId(userId)
      };

      const employee = await this.__employeeService.createEmployee(employeeData);

      res.status(STATUS_CODE.CREATED).json({
        status: true,
        message: 'Employee created successfully',
        data: employee
      });
    } catch (error: any) {
      console.error('Error creating employee:', error);
      if (error.message === 'Employee ID already exists' || error.message === 'Email already exists') {
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

  async getEmployees(req: Request, res: Response): Promise<void> {
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

      const filterData = JSON.parse(filter) as EmployeeFilterType;
      const response = await this.__employeeService.getEmployees(
        Number(page),
        Number(limit),
        filterData,
        search
      );

      res.status(STATUS_CODE.OK).json({
        status: true,
        message: 'Employees fetched successfully',
        data: response
      });
    } catch (error) {
      res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
        status: false,
        message: MESSAGE_CONST.INTERNAL_SERVER_ERROR
      });
    }
  }

  async getEmployeeById(req: Request, res: Response): Promise<void> {
    try {
      const employeeId = req.params.id;

      if (!employeeId) {
        res.status(STATUS_CODE.BAD_REQUEST).json({
          status: false,
          message: 'Employee ID is required'
        });
        return;
      }

      const employee = await this.__employeeService.getEmployeeById(employeeId);

      if (!employee) {
        res.status(STATUS_CODE.NOT_FOUND).json({
          status: false,
          message: 'Employee not found'
        });
        return;
      }

      res.status(STATUS_CODE.OK).json({
        status: true,
        message: 'Employee fetched successfully',
        data: employee
      });
    } catch (error) {
      res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
        status: false,
        message: MESSAGE_CONST.INTERNAL_SERVER_ERROR
      });
    }
  }

  async updateEmployee(req: CustomRequestType, res: Response): Promise<void> {
    try {
      const employeeId = req.params.id;
      const userId = req.user?.id;

      if (!userId) {
        res.status(STATUS_CODE.UNAUTHORIZED).json({
          status: false,
          message: MESSAGE_CONST.UNAUTHORIZED
        });
        return;
      }

      if (!employeeId) {
        res.status(STATUS_CODE.BAD_REQUEST).json({
          status: false,
          message: 'Employee ID is required'
        });
        return;
      }

      const updateData: UpdateEmployeeType = {};



      if (req.body.name !== undefined) {
        if (!req.body.name.trim()) {
          res.status(STATUS_CODE.BAD_REQUEST).json({
            status: false,
            message: 'Employee name cannot be empty'
          });
          return;
        }
        updateData.name = req.body.name.trim();
      }

      if (req.body.email !== undefined) {
        if (!req.body.email.trim()) {
          res.status(STATUS_CODE.BAD_REQUEST).json({
            status: false,
            message: 'Email cannot be empty'
          });
          return;
        }
        updateData.email = req.body.email.trim().toLowerCase();
      }

      if (req.body.phoneNumber !== undefined) {
        updateData.phoneNumber = req.body.phoneNumber.trim();
      }

      if (req.body.designation !== undefined) {
        updateData.designation = new mongoose.Types.ObjectId(req.body.designation);
      }

      if (req.body.dateOfJoining !== undefined) {
        updateData.dateOfJoining = new Date(req.body.dateOfJoining);
      }

      
      if (req.body.address !== undefined) {
        updateData.address = req.body.address?.trim() || '';
      }

      if (req.body.status !== undefined) {
        updateData.status = req.body.status;
      }

      if (req.file) {
        updateData.profilePicture = req.file.path;
      }

      const employee = await this.__employeeService.updateEmployee(employeeId, updateData);

      if (!employee) {
        res.status(STATUS_CODE.NOT_FOUND).json({
          status: false,
          message: 'Employee not found'
        });
        return;
      }

      res.status(STATUS_CODE.OK).json({
        status: true,
        message: MESSAGE_CONST.UPDATION_SUCCESS,
        data: employee
      });
    } catch (error: any) {
      if (error.message === 'Employee ID already exists' || error.message === 'Email already exists') {
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

  async deleteEmployee(req: Request, res: Response): Promise<void> {
    try {
      const employeeId = req.params.id;

      if (!employeeId) {
        res.status(STATUS_CODE.BAD_REQUEST).json({
          status: false,
          message: 'Employee ID is required'
        });
        return;
      }

      const deleted = await this.__employeeService.deleteEmployee(employeeId);

      if (!deleted) {
        res.status(STATUS_CODE.NOT_FOUND).json({
          status: false,
          message: 'Employee not found'
        });
        return;
      }

      res.status(STATUS_CODE.OK).json({
        status: true,
        message: 'Employee deleted successfully'
      });
    } catch (error) {
      res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
        status: false,
        message: MESSAGE_CONST.INTERNAL_SERVER_ERROR
      });
    }
  }

  async getAllActiveEmployees(req: Request, res: Response): Promise<void> {
    try {
      const employees = await this.__employeeService.getAllActiveEmployees();

      res.status(STATUS_CODE.OK).json({
        status: true,
        message: 'Active employees fetched successfully',
        data: employees
      });
    } catch (error) {
      res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
        status: false,
        message: MESSAGE_CONST.INTERNAL_SERVER_ERROR
      });
    }
  }
}