import { StaffBasicType } from "../../../types/staffType";

export interface IStaffRepository {
  createStaff(staffData: StaffBasicType): Promise<any>;
}