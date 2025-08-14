import { StaffResponse, UserData } from "../../../dto/dtoTypes/users/usersDto";
import { StaffBasicType, StaffUpdateType } from "../../../types/staffType";

export interface IStaffRepository {
  createStaff(staffData: StaffBasicType): Promise<any>;
  getActiveStaff(page: number, limit: number, role: string, status: number): Promise<StaffResponse>;
  updateStaff(staffId: string, staffData: StaffUpdateType): Promise<UserData | null>;
  updateStaffStatus(staffId: string, status: number): Promise<UserData | null>;
  getAllActive():Promise<UserData[]>
  getStaffById(id: string):Promise<any>
}