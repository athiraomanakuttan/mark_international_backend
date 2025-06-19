import UserModel from "../model/userModel";
import { IUser } from "../types/modelTypes";
import { IAuthRepository } from "./interface/IAuthRepository";

export class AuthRepository implements IAuthRepository {
  
    async getUserByPhoneNumber(phoneNumber: string): Promise<IUser | null> {
        
        try {
            const user = await UserModel.findOne({ phoneNumber }).exec();
            return user ? user.toObject() as IUser : null;
        } catch (error) {
            throw new Error(`Error fetching user by phone number: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async login(phoneNumber: string, password: string): Promise<IUser | null> {
        try {
            const user = await UserModel.findOne({ phoneNumber, password }).exec();
            return user ? user.toObject() as IUser : null;
        } catch (error) {
            throw new Error(`Error during login: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
 
}
}