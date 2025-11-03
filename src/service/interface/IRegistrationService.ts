import { IRegistration, CreateRegistrationDto, RegistrationResponse } from '../../types/registrationTypes';

export interface IRegistrationService {
  createRegistration(
    registrationData: CreateRegistrationDto, 
    files: Express.Multer.File[]
  ): Promise<RegistrationResponse>;
  getRegistrationById(registrationId: string): Promise<IRegistration | null>;
  getAllRegistrations(page: number, limit: number): Promise<{ registrations: IRegistration[], total: number }>;
  updateRegistration(registrationId: string, updateData: Partial<IRegistration>): Promise<IRegistration | null>;
  deleteRegistration(registrationId: string): Promise<boolean>;
}