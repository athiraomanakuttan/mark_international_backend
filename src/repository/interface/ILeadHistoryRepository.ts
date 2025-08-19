import { ILeadHistory } from "../../model/leadHistoryModel";

export interface ILeadHistoryRepository {
    createLeadHistory(data: ILeadHistory): Promise<ILeadHistory>;
    getLeadHistory(id: string): Promise<ILeadHistory | null>;
}