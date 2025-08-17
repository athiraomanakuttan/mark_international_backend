export interface IDashboardLeadService{
    getDashboardLeadData(userId:string):Promise<any>
    getStaffWiseReport(from: Date, to: Date, staffId: string): Promise<any>
}