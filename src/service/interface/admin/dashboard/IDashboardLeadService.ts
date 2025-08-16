export interface IDashboardLeadService{
    getDashboardLeadData():Promise<any>
    getStaffWiseReport(from:Date, to:Date):Promise<any>
}