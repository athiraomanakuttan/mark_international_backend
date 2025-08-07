import { StaffResponse, UserData } from "../../dto/dtoTypes/users/usersDto";
import { IStaffRepository } from "../../repository/interface/admin/IStaffRepository";
import { StaffBasicType, StaffUpdateType } from "../../types/staffType";
import { IStaffService } from "../interface/admin/IStaffService";
import bcrypt from 'bcryptjs'

export class StaffService implements IStaffService {
    private __staffRepository: IStaffRepository
    constructor(staffRepository: IStaffRepository) {
        this.__staffRepository = staffRepository;

    }
    async createStaff(staff: StaffBasicType): Promise<any> {
        try {
            const hashedPassword = await bcrypt.hash(staff.password, 10);
            const response = await this.__staffRepository.createStaff({ ...staff, password: hashedPassword });
            return response;
        } catch (err:any) {
            if (err.message === "Phone number already in use") {
                throw { code: 11000, keyPattern: { phoneNumber: 1 } };
            }
            throw new Error("Failed to create staff");
        
    }
}
    async getActiveStaff(page: number, limit: number, role: string, status: number = 1): Promise<StaffResponse> {
        try {
            const response = await this.__staffRepository.getActiveStaff(page, limit, role, status);
            return response;
        } catch (err) {
            throw new Error("Failed to retrieve active staff");
        }
    }

    async updateStaff(staffId: string, staffData: StaffUpdateType): Promise<any> {
        try {
            if (staffData?.password) {
                const hashedPassword = await bcrypt.hash(staffData.password, 10);
                staffData.password = hashedPassword;
            }
            const response = await this.__staffRepository.updateStaff(staffId, staffData);
            return response;
        } catch (err) {
            throw new Error("Failed to update staff");
        }
    }

    async updateStaffStatus(staffId: string, status: number): Promise<UserData | null> {
        try {
            const response = await this.__staffRepository.updateStaffStatus(staffId, status);
            return response;
        } catch (err) {
            throw new Error("Failed to update staff status");
        }
    }
}