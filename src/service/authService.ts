import { IAuthRepository } from "../repository/interface/IAuthRepository";
import { loginType } from "../types/authTypes";
import { IAuthService } from "./interface/IAuthService";

export class AuthService  implements IAuthService {
    private __authRepository:IAuthRepository
  constructor(authService : IAuthRepository) {
    this.__authRepository = authService
  }

  // login user with phone number and password
  async login(data: loginType): Promise<string> {
    if (!data.phoneNumber || !data.password) {
      throw new Error("Phone number and password are required");
    }

    // Call the repository method to handle login logic
    // const token = await this.__authRepository.login(data);
    const token = ""
    
    if (!token) {
      throw new Error("Invalid phone number or password");
    }

    return token;
  }
}