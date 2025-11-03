import { IRegistrationService } from './interface/IRegistrationService';
import { IRegistrationRepository } from '../repository/interface/IRegistrationRepository';
import { IRegistration, CreateRegistrationDto, RegistrationResponse, RegistrationFormErrors } from '../types/registrationTypes';
import { cloudinary } from '../config/cloudinaryConfig';
import { UploadApiResponse } from 'cloudinary';

export class RegistrationService implements IRegistrationService {
  private __registrationRepository: IRegistrationRepository;

  constructor(registrationRepository: IRegistrationRepository) {
    this.__registrationRepository = registrationRepository;
  }

  async createRegistration(
    registrationData: CreateRegistrationDto,
    files: Express.Multer.File[]
  ): Promise<RegistrationResponse> {
    try {
      // Validate required fields
      const errors = this.validateRegistrationData(registrationData);
      if (Object.keys(errors).length > 0) {
        return {
          success: false,
          message: 'Validation failed',
          errors
        };
      }

      // Upload files to Cloudinary
      const documentUrls = await this.uploadFilesToCloudinary(files);

      // Transform data for database
      const registrationPayload: IRegistration = {
        name: registrationData.name,
        dateOfBirth: new Date(registrationData.dateOfBirth),
        contactNumber: registrationData.contactNumber,
        maritalStatus: registrationData.maritalStatus as 'single' | 'married' | 'divorced' | 'widowed',
        address: {
          street: registrationData.street,
          city: registrationData.city,
          state: registrationData.state,
          pincode: registrationData.pincode,
          country: registrationData.country
        },
        documents: documentUrls,
        status: 1 // pending
      };

      // Save to database
      const savedRegistration = await this.__registrationRepository.createRegistration(registrationPayload);

      return {
        success: true,
        message: 'Registration created successfully',
        data: savedRegistration
      };
    } catch (error) {
      console.error('Error creating registration:', error);
      return {
        success: false,
        message: 'Failed to create registration'
      };
    }
  }

  async getRegistrationById(registrationId: string): Promise<IRegistration | null> {
    try {
      return await this.__registrationRepository.getRegistrationById(registrationId);
    } catch (error) {
      throw error;
    }
  }

  async getAllRegistrations(page: number, limit: number): Promise<{ registrations: IRegistration[], total: number }> {
    try {
      return await this.__registrationRepository.getAllRegistrations(page, limit);
    } catch (error) {
      throw error;
    }
  }

  async updateRegistration(registrationId: string, updateData: Partial<IRegistration>): Promise<IRegistration | null> {
    try {
      return await this.__registrationRepository.updateRegistration(registrationId, updateData);
    } catch (error) {
      throw error;
    }
  }

  async deleteRegistration(registrationId: string): Promise<boolean> {
    try {
      return await this.__registrationRepository.deleteRegistration(registrationId);
    } catch (error) {
      throw error;
    }
  }

  private validateRegistrationData(data: CreateRegistrationDto): RegistrationFormErrors {
    const errors: RegistrationFormErrors = {};

    if (!data.name || data.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters long';
    }

    if (!data.dateOfBirth) {
      errors.dateOfBirth = 'Date of birth is required';
    } else {
      const dob = new Date(data.dateOfBirth);
      if (isNaN(dob.getTime())) {
        errors.dateOfBirth = 'Invalid date format';
      } else if (dob > new Date()) {
        errors.dateOfBirth = 'Date of birth cannot be in the future';
      }
    }

    if (!data.contactNumber || !/^\d{10,15}$/.test(data.contactNumber)) {
      errors.contactNumber = 'Contact number must be between 10-15 digits';
    }

    if (!data.maritalStatus || !['single', 'married', 'divorced', 'widowed'].includes(data.maritalStatus)) {
      errors.maritalStatus = 'Please select a valid marital status';
    }

    // Address validation
    const addressErrors: any = {};
    if (!data.street || data.street.trim().length < 3) {
      addressErrors.street = 'Street address must be at least 3 characters long';
    }
    if (!data.city || data.city.trim().length < 2) {
      addressErrors.city = 'City must be at least 2 characters long';
    }
    if (!data.state || data.state.trim().length < 2) {
      addressErrors.state = 'State must be at least 2 characters long';
    }
    if (!data.pincode || !/^\d{5,10}$/.test(data.pincode)) {
      addressErrors.pincode = 'Pincode must be between 5-10 digits';
    }
    if (!data.country || data.country.trim().length < 2) {
      addressErrors.country = 'Country must be at least 2 characters long';
    }

    if (Object.keys(addressErrors).length > 0) {
      errors.address = addressErrors;
    }

    return errors;
  }

  private async uploadFilesToCloudinary(files: Express.Multer.File[]): Promise<Array<{ title: string, url: string }>> {
    const uploadPromises = files.map(async (file) => {
      return new Promise<{ title: string, url: string }>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: 'auto',
            folder: 'registrations',
            use_filename: true,
            unique_filename: true
          },
          (error, result: UploadApiResponse | undefined) => {
            if (error) {
              console.error('Cloudinary upload error:', error);
              reject(error);
            } else if (result) {
              resolve({
                title: file.originalname,
                url: result.secure_url
              });
            } else {
              reject(new Error('Upload failed - no result'));
            }
          }
        );
        
        uploadStream.end(file.buffer);
      });
    });

    try {
      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Error uploading files:', error);
      throw new Error('Failed to upload documents');
    }
  }
}