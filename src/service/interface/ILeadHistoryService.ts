import {ILeadHistory} from "../../model/leadHistoryModel";
export interface ILeadHistoryService{
    createLeadHistory(data: ILeadHistory): Promise<any>;
    getLeadHistory(id: string): Promise<ILeadHistory | null>;
    
}