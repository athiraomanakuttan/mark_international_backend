import { IDesignationRepository } from '../repository/interface/IDesignationRepository';
import { IDesignationService } from './interface/IDesignationService';
import { DesignationBasicType, UpdateDesignationType, DesignationFilterType } from '../types/designationTypes';
import { DesignationDto } from '../dto/dtoTypes/designationDto';
import { designationDtoMapper, designationsMapper } from '../dto/dtoMapper/designationDtoMapper';

export class DesignationService implements IDesignationService {
  private __designationRepository: IDesignationRepository;

  constructor(designationRepository: IDesignationRepository) {
    this.__designationRepository = designationRepository;
  }

  async createDesignation(designationData: DesignationBasicType): Promise<DesignationDto> {
    try {
      // Check if designation name already exists
      const exists = await this.__designationRepository.checkDesignationExists(designationData.name);
      if (exists) {
        throw new Error('Designation with this name already exists');
      }

      const designation = await this.__designationRepository.createDesignation(designationData);
      return designationDtoMapper(designation);
    } catch (error) {
      throw error;
    }
  }

  async getDesignations(page: number = 1, limit: number = 10, filterData: DesignationFilterType, search: string = ''): Promise<{ designations: DesignationDto[], totalRecords: number }> {
    try {
      const response = await this.__designationRepository.getDesignations(page, limit, filterData, search);
      const designations = designationsMapper(response.designations);
      return {
        designations,
        totalRecords: response.totalRecords
      };
    } catch (error) {
      throw error;
    }
  }

  async getDesignationById(designationId: string): Promise<DesignationDto | null> {
    try {
      const designation = await this.__designationRepository.getDesignationById(designationId);
      if (!designation) {
        return null;
      }
      return designationDtoMapper(designation);
    } catch (error) {
      throw error;
    }
  }

  async updateDesignation(designationId: string, designationData: UpdateDesignationType): Promise<DesignationDto | null> {
    try {
      // Check if updating name and it already exists (excluding current designation)
      if (designationData.name) {
        const exists = await this.__designationRepository.checkDesignationExists(designationData.name, designationId);
        if (exists) {
          throw new Error('Designation with this name already exists');
        }
      }

      const designation = await this.__designationRepository.updateDesignation(designationId, designationData);
      if (!designation) {
        return null;
      }
      return designationDtoMapper(designation);
    } catch (error) {
      throw error;
    }
  }

  async deleteDesignation(designationId: string): Promise<boolean> {
    try {
      return await this.__designationRepository.deleteDesignation(designationId);
    } catch (error) {
      throw error;
    }
  }

  async getAllActiveDesignations(): Promise<DesignationDto[]> {
    try {
      const designations = await this.__designationRepository.getAllActiveDesignations();
      return designationsMapper(designations);
    } catch (error) {
      throw error;
    }
  }
}