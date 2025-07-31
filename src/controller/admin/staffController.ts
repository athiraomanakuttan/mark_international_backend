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
      console.log("staffData  ====>", staffData);
      if (!staffData || !staffData.name) {
        res.status(STATUS_CODE.BAD_REQUEST).json({ error: "Invalid staff data" });
        return;
      }
      const createdStaff = await this.__staffService.createStaff(staffData);
      res.status(STATUS_CODE.CREATED).json(createdStaff);
    } catch (error) {
      console.error("Error creating staff:", error);
      res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ error: "Failed to create staff" });
    }
  }
}

export default StaffController;