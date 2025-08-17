export interface IDashboardLeadRepository{
    getDashboardLeadData(staffId: string):Promise<any>
    getStaffWiseReport(fromDate: Date, toDate: Date, staffId: string): Promise<any>
}