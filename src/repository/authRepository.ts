import UserModel from "../model/userModel";
import { IUser } from "../types/modelTypes";
import { IAuthRepository } from "./interface/IAuthRepository";

export class AuthRepository implements IAuthRepository {
  
    async getUserByPhoneNumber(phoneNumber: string): Promise<IUser | null> {
        
        try {
            const user = await UserModel.findOne({ phoneNumber });
            return user ? user.toObject() as IUser : null;
        } catch (error) {
            throw new Error(`Error fetching user by phone number: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async updatePassword(password: string, userId: string): Promise<IUser | null> {
        try {
            const data = await UserModel.findOneAndUpdate({_id: userId},{$set:{password}},{new: true})
             return data ? data.toObject() as IUser : null;
        } catch (error) {
                        throw new Error(`Error updating admin by Id: ${error instanceof Error ? error.message : 'Unknown error'}`);

        }
    }


   
}