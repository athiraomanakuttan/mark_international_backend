import { StaffResponse, UserData } from "../../../dto/dtoTypes/users/usersDto";
import { StaffBasicType, StaffUpdateType } from "../../../types/staffType";

export interface IStaffService {
    createStaff(staff: StaffBasicType): Promise<any>;
    getActiveStaff(page: number, limit: number, role: string, status: number): Promise<StaffResponse | null>;
    updateStaff(staffId: string, staffData: StaffUpdateType): Promise<UserData | null>;
}