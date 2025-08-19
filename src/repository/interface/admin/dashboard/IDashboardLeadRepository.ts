export interface IDashboardLeadRepository{
    getDashboardLeadData(from: Date, to:Date):Promise<any>
    getStaffWiseReport(fromDate: Date, toDate: Date):Promise<any>
    getMonthWiseReport(currentMonthStartDate: Date, currentDate: Date, prevMonthFirstDate: Date, prevMonthLastDate: Date): Promise<any>
}