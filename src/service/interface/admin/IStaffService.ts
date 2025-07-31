import { StaffBasicType } from "../../../types/staffType";

export interface IStaffService {
    createStaff(staff: StaffBasicType): Promise<any>;
}