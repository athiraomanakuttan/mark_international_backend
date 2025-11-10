export interface ResignationDto {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeEmail: string;
  designation: string;
  reason: string;
  document: string;
  status: number;
  statusText: string;
  adminComments?: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}
