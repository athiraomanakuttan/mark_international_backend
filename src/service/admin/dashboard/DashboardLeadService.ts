import { IDashboardLeadRepository } from "../../../repository/interface/admin/dashboard/IDashboardLeadRepository";
import { IDashboardLeadService } from "../../interface/admin/dashboard/IDashboardLeadService";

export class DashboardLeadService implements IDashboardLeadService{
    private __dashboardRepository : IDashboardLeadRepository
    constructor(dashboardRepository: IDashboardLeadRepository){
        this.__dashboardRepository= dashboardRepository
    }
    async getDashboardLeadData(from: Date, to: Date): Promise<any> {
        try {
            return this.__dashboardRepository.getDashboardLeadData(from, to)
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
    async getMonthWiseReport(currentMonthStartDate: Date, currentDate: Date, prevMonthFirstDate: Date, prevMonthLastDate: Date): Promise<any> {
        try {
            return this.__dashboardRepository.getMonthWiseReport(currentMonthStartDate, currentDate, prevMonthFirstDate, prevMonthLastDate)
        } catch (error) {
            throw error
        }
    }
}