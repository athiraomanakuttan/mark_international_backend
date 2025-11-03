import { IRegistration } from '../../types/registrationTypes';

export interface IRegistrationRepository {
  createRegistration(registrationData: IRegistration): Promise<IRegistration>;
  getRegistrationById(registrationId: string): Promise<IRegistration | null>;
  getAllRegistrations(page: number, limit: number): Promise<{ registrations: IRegistration[], total: number }>;
  updateRegistration(registrationId: string, updateData: Partial<IRegistration>): Promise<IRegistration | null>;
  deleteRegistration(registrationId: string): Promise<boolean>;
}