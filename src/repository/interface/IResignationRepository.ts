import { 
  ResignationBasicType, 
  ResignationType, 
  ResignationFilterType, 
  ResignationResponseType,
  ApproveRejectResignationType,
  ResignationStatsType,
  UpdateResignationType
} from '../../types/resignationTypes';

export interface IResignationRepository {
  createResignation(resignationData: ResignationBasicType): Promise<ResignationType>;
  getResignationById(resignationId: string): Promise<ResignationType | null>;
  getResignationsByStaffId(staffId: string): Promise<ResignationType[]>;
  getResignations(page: number, limit: number, status?: number, search?: string): Promise<ResignationResponseType | null>;
  updateResignation(resignationId: string, resignationData: UpdateResignationType): Promise<ResignationType | null>;
  approveOrRejectResignation(resignationId: string, updateData: ApproveRejectResignationType): Promise<ResignationType | null>;
  deleteResignation(resignationId: string): Promise<boolean>;
  getResignationStats(): Promise<ResignationStatsType>;
}