import { DesignationBasicType, DesignationType, UpdateDesignationType, DesignationFilterType, DesignationResponseType } from '../../types/designationTypes';

export interface IDesignationRepository {
  createDesignation(designationData: DesignationBasicType): Promise<DesignationType>;
  getDesignations(page: number, limit: number, filterData: DesignationFilterType, search: string): Promise<DesignationResponseType>;
  getDesignationById(designationId: string): Promise<DesignationType | null>;
  updateDesignation(designationId: string, designationData: UpdateDesignationType): Promise<DesignationType | null>;
  deleteDesignation(designationId: string): Promise<boolean>;
  checkDesignationExists(name: string, excludeId?: string): Promise<boolean>;
  getAllActiveDesignations(): Promise<DesignationType[]>;
}