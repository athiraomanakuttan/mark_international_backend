import { StaffBasicType } from "../../types/staffType";
import { IStaffRepository } from "../interface/admin/IStaffRepository";
import User from '../../model/userModel'

class StaffRepository implements IStaffRepository {
  async createStaff(staffData: StaffBasicType): Promise<any> {
    

    try {
  const newUser = new User(staffData);
    await newUser.save();
    return newUser;
} catch (err: any) {
  if (err.code === 11000 && err.keyPattern?.phoneNumber) {
    throw new Error("Phone number already in use");
  }
  throw new Error("Failed to create staff");
}

  }
  }


export default StaffRepository;
