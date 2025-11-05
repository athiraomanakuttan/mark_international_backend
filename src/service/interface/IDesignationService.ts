import { DesignationBasicType, UpdateDesignationType, DesignationFilterType } from '../../types/designationTypes';
import { DesignationDto } from '../../dto/dtoTypes/designationDto';

export interface IDesignationService {
  createDesignation(designationData: DesignationBasicType): Promise<DesignationDto>;
  getDesignations(page: number, limit: number, filterData: DesignationFilterType, search: string): Promise<{ designations: DesignationDto[], totalRecords: number }>;
  getDesignationById(designationId: string): Promise<DesignationDto | null>;
  updateDesignation(designationId: string, designationData: UpdateDesignationType): Promise<DesignationDto | null>;
  deleteDesignation(designationId: string): Promise<boolean>;
  getAllActiveDesignations(): Promise<DesignationDto[]>;
}