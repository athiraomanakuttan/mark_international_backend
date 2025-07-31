import { IStaffRepository } from "../../repository/interface/admin/IStaffRepository";
import { StaffBasicType } from "../../types/staffType";
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
        } catch (error) {
            console.error("Error creating staff:", error);
            throw new Error("Failed to create staff");
        }
    }
}