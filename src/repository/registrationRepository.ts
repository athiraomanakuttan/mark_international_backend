import { IRegistrationRepository } from './interface/IRegistrationRepository';
import RegistrationModel from '../model/registrationModel';
import { IRegistration } from '../types/registrationTypes';
import { Document } from 'mongoose';

export class RegistrationRepository implements IRegistrationRepository {
  async createRegistration(registrationData: IRegistration): Promise<IRegistration> {
    try {
      const newRegistration = new RegistrationModel(registrationData);
      await newRegistration.save();
      return newRegistration.toObject();
    } catch (error) {
      throw new Error('Failed to create registration');
    }
  }

  async getRegistrationById(registrationId: string): Promise<IRegistration | null> {
    try {
      const registration = await RegistrationModel.findById(registrationId);
      return registration ? registration.toObject() : null;
    } catch (error) {
      throw new Error('Failed to get registration by ID');
    }
  }

  async getAllRegistrations(page: number, limit: number): Promise<{ registrations: IRegistration[], total: number }> {
    try {
      const skip = (page - 1) * limit;
      const registrations = await RegistrationModel.find()
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });
      
      const total = await RegistrationModel.countDocuments();
      
      return {
        registrations: registrations.map((reg: IRegistration & Document) => reg.toObject()),
        total
      };
    } catch (error) {
      throw new Error('Failed to get registrations');
    }
  }

  async updateRegistration(registrationId: string, updateData: Partial<IRegistration>): Promise<IRegistration | null> {
    try {
      const updatedRegistration = await RegistrationModel.findByIdAndUpdate(
        registrationId,
        updateData,
        { new: true }
      );
      return updatedRegistration ? updatedRegistration.toObject() : null;
    } catch (error) {
      throw new Error('Failed to update registration');
    }
  }

  async deleteRegistration(registrationId: string): Promise<boolean> {
    try {
      const result = await RegistrationModel.findByIdAndDelete(registrationId);
      return !!result;
    } catch (error) {
      throw new Error('Failed to delete registration');
    }
  }
}