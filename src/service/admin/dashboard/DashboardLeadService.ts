import { IDashboardLeadRepository } from "../../../repository/interface/admin/dashboard/IDashboardLeadRepository";
import { IDashboardLeadService } from "../../interface/admin/dashboard/IDashboardLeadService";

export class DashboardLeadService implements IDashboardLeadService{
    private __dashboardRepository : IDashboardLeadRepository
    constructor(dashboardRepository: IDashboardLeadRepository){
        this.__dashboardRepository= dashboardRepository
    }
    async getDashboardLeadData(): Promise<any> {
        try {
            return this.__dashboardRepository.getDashboardLeadData()
        } catch (error) {
            throw error
        }
    }

    async getStaffWiseReport(from: Date, to: Date): Promise<any> {
        try {
            return this.__dashboardRepository.getStaffWiseReport(from, to)
        } catch (error) {
            throw error
        }
    }
}