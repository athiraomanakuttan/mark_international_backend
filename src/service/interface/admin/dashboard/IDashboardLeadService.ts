export interface IDashboardLeadService{
    getDashboardLeadData(from: Date, to: Date):Promise<any>
    getStaffWiseReport(from: Date, to: Date):Promise<any>
    getMonthWiseReport(currentMonthStartDate: Date, currentDate: Date, prevMonthFirstDate: Date, prevMonthLastDate: Date): Promise<any>
}