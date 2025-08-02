import { StaffBasicType } from "../../types/staffType";
import { IStaffRepository } from "../interface/admin/IStaffRepository";
import User from '../../model/userModel'
import {mapUsersToDto} from '../../dto/dtoMapper/users/userDtoMapper'
import { StaffResponse, UserData } from "../../dto/dtoTypes/users/usersDto";
import { createDeflate } from "zlib";

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

  async getActiveStaff(page: number, limit: number, role: string, status: number): Promise<StaffResponse> {
    try {
      const skip = (page - 1) * limit;
      const staffList = await User.find({ role, isActive: status }).sort({createdAt: -1})
        .skip(skip)
        .limit(limit)
        console.log("staffList",staffList)
        const DtoData = mapUsersToDto(staffList);
        const totalRecords = await User.find({role,isActive:status}).countDocuments();
      console.log("DtoData", DtoData)
      return { users: DtoData, totalRecords } as StaffResponse;
    } catch (err) {
      throw new Error("Failed to retrieve active staff");
    }
  }
}

export default StaffRepository;
