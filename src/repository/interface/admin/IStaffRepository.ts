import { StaffResponse, UserData } from "../../../dto/dtoTypes/users/usersDto";
import { StaffBasicType } from "../../../types/staffType";

export interface IStaffRepository {
  createStaff(staffData: StaffBasicType): Promise<any>;
  getActiveStaff(page: number, limit: number, role: string, status: number): Promise<StaffResponse>;
}