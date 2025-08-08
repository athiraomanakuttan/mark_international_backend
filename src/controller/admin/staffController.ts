import { IStaffService } from "../../service/interface/admin/IStaffService";
import { Request, Response } from "express";
import { STATUS_CODE } from "../../constance/statusCode";
import { StaffBasicType, StaffUpdateType } from "../../types/staffType";
import { MESSAGE_CONST } from "../../constant/MessageConst";
class StaffController {
  private __staffService: IStaffService;

  constructor(staffService: IStaffService) {
    this.__staffService = staffService;
  }

  async createStaff(req: Request, res: Response): Promise<void> {
    try {
      const staffData: StaffBasicType = req.body;
      if (!staffData || !staffData.name) {
        res.status(STATUS_CODE.BAD_REQUEST).json({ error: "Invalid staff data" });
        return;
      }
      const createdStaff = await this.__staffService.createStaff(staffData);
      console.log("Created staff:", createdStaff);
      res.status(STATUS_CODE.CREATED).json({status: true, message:"Staff created successfully", data: createdStaff});
    } catch (err: any) {
      console.log("error in controller",err)
      if (err.code === 11000 && err.keyPattern?.phoneNumber) {
      res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ status: false, message: "Phone number already in use" });
      return;}
      res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ status: false, message: "Failed to create staff" });
    }
  }

  async getActiveStaff(req: Request, res: Response): Promise<void> {
    try {
      const {page = 1,limit = 10, status=1, role = "staff"} = req.query;
      const staffList = await this.__staffService.getActiveStaff(Number(page), Number(limit), String(role),Number(status));
      res.status(STATUS_CODE.OK).json({ status: true, data: staffList });
    } catch (error) {
      console.log("error in controller", error);
      res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ status: false, message: "Failed to retrieve staff" });
    }

  }

  async updateStaff(req: Request, res: Response): Promise<void> {
    try {
      const staffId = req.params.id;
      const staffData: StaffUpdateType = req.body;
      console.log("staffData", staffData)
      if (!staffId || !staffData) {
        res.status(STATUS_CODE.BAD_REQUEST).json({ error: "Invalid staff ID or data" });
        return;
      }
      const updatedStaff = await this.__staffService.updateStaff(staffId, staffData);
      res.status(STATUS_CODE.OK).json({ status: true, message: "Staff updated successfully", data: updatedStaff });
    } catch (error) {
      console.log("error in controller", error);
      res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ status: false, message: "Failed to update staff" });
    }
  }

  async updateStaffStatus(req: Request, res: Response): Promise<void> {
    try {
      const staffId = req.params.id;
      const status = Number(req.params.status);
      console.log("staffId", staffId, "status", status);
      if (!staffId) {
        res.status(STATUS_CODE.BAD_REQUEST).json({ error: "Invalid staff ID" });
        return;
      }
      if(isNaN(status) || status>1 || status<-1){
        res.status(STATUS_CODE.BAD_REQUEST).json({ error: "Invalid status value" });
        return;
      }
      const updatedStaff = await this.__staffService.updateStaffStatus(staffId, status);
      res.status(STATUS_CODE.OK).json({ status: true, message: "Staff status updated successfully", data: updatedStaff });
    } catch (error) {
      console.log("error in controller", error);
      res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ status: false, message: "Failed to update staff status" });
    }
  } 

  async getAllActive(req:Request, res:Response):Promise<void>{
    try {
      const response = await this.__staffService.getAllActive()
      if(response){
        res.status(STATUS_CODE.OK).json({status: true, message:"data fetched sucess", data: response})
      }
    } catch (error) {
      res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({status: false, meessage:MESSAGE_CONST.INTERNAL_SERVER_ERROR, data:[]})
    }
  }
}

export default StaffController;