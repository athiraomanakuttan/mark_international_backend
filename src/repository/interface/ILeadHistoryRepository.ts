import { ILeadHistory } from "../../model/leadHistoryModel";

export interface ILeadHistoryRepository {
    createLeadHistory(data: ILeadHistory): Promise<ILeadHistory>;
    getLeadHistory(id: string, page: number, limit: number): Promise<ILeadHistory | null>;
}