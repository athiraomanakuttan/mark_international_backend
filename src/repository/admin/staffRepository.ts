import { StaffBasicType } from "../../types/staffType";
import { IStaffRepository } from "../interface/admin/IStaffRepository";
import User from '../../model/userModel'

class StaffRepository implements IStaffRepository {
  async createStaff(staffData: StaffBasicType): Promise<any> {
    const newUser = new User(staffData);
    await newUser.save();
    return newUser;
  }
  }


export default StaffRepository;
