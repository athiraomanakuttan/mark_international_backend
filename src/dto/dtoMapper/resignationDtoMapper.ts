import { ResignationType } from '../../types/resignationTypes';
import { formatDate } from '../../utils/formatDate';
import { ResignationDto } from '../dtoTypes/resignationDto';

const getStatusText = (status: number): string => {
  switch (status) {
    case 0:
      return 'Pending';
    case 1:
      return 'Approved';
    case 2:
      return 'Rejected';
    default:
      return 'Unknown';
  }
};

export const resignationDtoMapper = (resignation: ResignationType): ResignationDto => {
  const employeeName = resignation.staffData?.[0]?.name || 'Unknown';
  
  console.log('🔄 Mapping resignation:', {
    id: resignation._id.toString(),
    staffId: resignation.staffId.toString(),
    hasStaffData: !!resignation.staffData,
    staffDataLength: resignation.staffData?.length,
    employeeName
  });

  return {
    id: resignation._id.toString(),
    employeeId: resignation.staffId.toString(),
    employeeName,
    employeeEmail: resignation.staffData?.[0]?.email || '',
    designation: '', // No designation from users collection
    reason: resignation.reason,
    document: resignation.document || '',
    status: resignation.status,
    statusText: getStatusText(resignation.status),
    adminComments: resignation.adminComments,
    reviewedAt: resignation.status !== 0 ? formatDate(resignation.updatedAt) : undefined,
    createdAt: formatDate(resignation.createdAt),
    updatedAt: formatDate(resignation.updatedAt),
  };
};

export const resignationsMapper = (resignations: ResignationType[]): ResignationDto[] => {
  return resignations.map((resignation) => resignationDtoMapper(resignation));
};
