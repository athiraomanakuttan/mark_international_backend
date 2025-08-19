import {ILeadHistory} from "../../model/leadHistoryModel";
export interface ILeadHistoryService{
    createLeadHistory(data: ILeadHistory): Promise<any>;
    getLeadHistory(id: string, page:number, limit:number): Promise<ILeadHistory | null>;
    
}