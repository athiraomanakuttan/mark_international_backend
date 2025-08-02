import { UserData } from "../../dto/dtoTypes/users/usersDto";
import { IUser } from "../../types/modelTypes";

export interface IAuthRepository {
  // login(email: string, password: string): Promise<IUser | null>;  
    getUserByPhoneNumber(phoneNumber: string): Promise<IUser | null>;
}