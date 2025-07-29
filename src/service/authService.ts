import { IAuthRepository } from "../repository/interface/IAuthRepository";
import { loginType, serviceLoginResponse } from "../types/authTypes";
import { IUser } from "../types/modelTypes";
import { generateAccessToken, generateRefreshToken } from "../utils/jwtToken";
import { IAuthService } from "./interface/IAuthService";
import bcrypt from 'bcryptjs'

export class AuthService  implements IAuthService {
    private __authRepository:IAuthRepository
  constructor(authService : IAuthRepository) {
    this.__authRepository = authService
  }

  // login user with phone number and password
  async login(data: loginType): Promise<serviceLoginResponse | null> { 
    if (!data.phoneNumber || !data.password) {
      return {status: false, message: "Phone number and password are required"};
    }
    let checkUser = await this.__authRepository.getUserByPhoneNumber(data.phoneNumber);
    console.log("checkUser",checkUser)
    if(!checkUser){
      return {status: false, message: "User not found"};
    }
    const isPasswordValid = await bcrypt.compare(data.password, checkUser.password);
    if (!isPasswordValid) {
      return {status: false, message: "Invalid password"};
    }
    const accessToken  =  generateAccessToken({id: checkUser._id , role: checkUser.role});
    const refreshToken  =  generateRefreshToken({id: checkUser._id , role: checkUser.role});
    return { status:true ,user:checkUser, accessToken, refreshToken};
  }
}