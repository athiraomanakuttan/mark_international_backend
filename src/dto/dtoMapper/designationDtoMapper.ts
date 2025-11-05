import { DesignationType } from '../../types/designationTypes';
import { formatDate } from '../../utils/formatDate';
import { DesignationDto } from '../dtoTypes/designationDto';

export const designationDtoMapper = (designation: DesignationType): DesignationDto => {
  return {
    id: designation._id,
    name: designation.name,
    description: designation.description || '',
    status: designation.status,
    createdAt: formatDate(designation.createdAt),
    updatedAt: formatDate(designation.updatedAt),
    createdById: designation?.createdByData?.[0]?._id || '',
    createdByName: designation?.createdByData?.[0]?.name || '',
  };
};

export const designationsMapper = (designations: DesignationType[]) => {
  return designations.map((designation) => designationDtoMapper(designation));
};