export interface IDashboardLeadRepository{
    getDashboardLeadData():Promise<any>
    getStaffWiseReport(fromDate: Date, toDate: Date):Promise<any>
}