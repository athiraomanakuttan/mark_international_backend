import { IDashboardLeadRepository } from "../../repository/interface/staff/IDashboardLeadRepository"
import { IDashboardLeadService } from "../interface/staff/IDashboardLeadService"


export class DashboardLeadService implements IDashboardLeadService{
    private __dashboardRepository : IDashboardLeadRepository
    constructor(dashboardRepository: IDashboardLeadRepository){
        this.__dashboardRepository= dashboardRepository 
    }
    async getDashboardLeadData(staffId: string): Promise<any> {
        try {
            return this.__dashboardRepository.getDashboardLeadData(staffId)
        } catch (error) {
            throw error
        }
    }
    async getStaffWiseReport(from: Date, to: Date, staffId: string): Promise<any> {
        try {
            return this.__dashboardRepository.getStaffWiseReport(from, to, staffId)
        } catch (error) {
            throw error
        }
    }


    
}