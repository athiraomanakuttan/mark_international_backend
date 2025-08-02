import { IStaffService } from "../../service/interface/admin/IStaffService";
import { Request, Response } from "express";
import { STATUS_CODE } from "../../constance/statusCode";
import { StaffBasicType } from "../../types/staffType";
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
      const {page = 1,limit = 10, status} = req.query;
      const staffList = await this.__staffService.getActiveStaff(Number(page), Number(limit), "staff",Number(status));
      res.status(STATUS_CODE.OK).json({ status: true, data: staffList });
    } catch (error) {
      console.log("error in controller", error);
      res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ status: false, message: "Failed to retrieve staff" });
    }

  }
}

export default StaffController;