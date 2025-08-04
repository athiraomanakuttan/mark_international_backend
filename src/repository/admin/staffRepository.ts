import { StaffBasicType, StaffUpdateType } from "../../types/staffType";
import { IStaffRepository } from "../interface/admin/IStaffRepository";
import User from '../../model/userModel'
import {mapUsersToDto} from '../../dto/dtoMapper/users/userDtoMapper'
import { StaffResponse, UserData } from "../../dto/dtoTypes/users/usersDto";

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

  async updateStaff(staffId: string, staffData: StaffUpdateType): Promise<UserData | null> {
    try {
      const updatedStaff = await User.findByIdAndUpdate(staffId, staffData, { new: true });
      console.log("updatedStaff", updatedStaff)
      if (!updatedStaff) {
        return null;
      }
      return mapUsersToDto([updatedStaff])[0];
    } catch (err) {
      throw new Error("Failed to update staff");
    }
  }

  async updateStaffStatus(staffId: string, status: number): Promise<UserData | null> {
    try {
      const updatedStaff = await User.findByIdAndUpdate(staffId, { isActive: status }, { new: true });
      console.log("updatedStaff", updatedStaff)
      if (!updatedStaff) {
        return null;
      }
      return mapUsersToDto([updatedStaff])[0];
    } catch (err) {
      console.log("error in updateStaffStatus", err);
      throw new Error("Failed to update staff status");
    }
  }
}

export default StaffRepository;
