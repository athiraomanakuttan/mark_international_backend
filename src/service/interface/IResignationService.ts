import { 
  ResignationBasicType, 
  ResignationType, 
  ResignationFilterType, 
  ResignationResponseType,
  ResignationStatsType,
  UpdateResignationType
} from '../../types/resignationTypes';
import { BasicResponse } from '../../types/basicResponse';

export interface IResignationService {
  createResignation(resignationData: ResignationBasicType): Promise<BasicResponse<ResignationType>>;
  getResignationById(resignationId: string): Promise<BasicResponse<ResignationType>>;
  getResignationsByStaffId(staffId: string): Promise<BasicResponse<ResignationType[]>>;
  getResignations(page: number, limit: number, status: number, search: string): Promise<BasicResponse<ResignationResponseType | null>>;
  updateResignation(resignationId: string, resignationData: UpdateResignationType, staffId?: string): Promise<BasicResponse<ResignationType>>;
  approveResignation(resignationId: string, adminId: string, adminComments?: string): Promise<BasicResponse<ResignationType>>;
  rejectResignation(resignationId: string, adminId: string, adminComments?: string): Promise<BasicResponse<ResignationType>>;
  deleteResignation(resignationId: string): Promise<BasicResponse<boolean>>;
  getResignationStats(): Promise<BasicResponse<ResignationStatsType>>;
}