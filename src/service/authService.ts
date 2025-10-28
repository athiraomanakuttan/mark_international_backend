import { mapUserToDto } from "../dto/dtoMapper/users/userDtoMapper";
import { IUserDto } from "../dto/dtoTypes/users/usersDto";
import { IAuthRepository } from "../repository/interface/IAuthRepository";
import { loginType, serviceLoginResponse } from "../types/authTypes";
import { IUser } from "../types/modelTypes";
import { comparePassword, hashPassword } from "../utils/hashPassword";
import { generateAccessToken, generateRefreshToken } from "../utils/jwtToken";
import { IAuthService } from "./interface/IAuthService";

export class AuthService  implements IAuthService {
    private __authRepository:IAuthRepository
  constructor(authService : IAuthRepository) {
    this.__authRepository = authService
  }

  // login user with phone number and password
  async login(data: loginType): Promise<IUserDto | null> { 
    if (!data.phoneNumber || !data.password) {
      return {status: false, message: "Phone number and password are required"};
    }
    let checkUser = await this.__authRepository.getUserByPhoneNumber(data.phoneNumber);
    if(!checkUser){
      return {status: false, message: "User not found"};
    }
    const isPasswordValid = await comparePassword(data.password, checkUser.password);
    if (!isPasswordValid) {
      return {status: false, message: "Invalid password"};
    }
    const accessToken  =  generateAccessToken({id: checkUser._id , role: checkUser.role});
    const refreshToken  =  generateRefreshToken({id: checkUser._id , role: checkUser.role});
    const userData = mapUserToDto(checkUser);
    return { status: true, message: "Login successful", user: userData, accessToken, refreshToken };
  }

  async resetPassword(password: string, userId: string): Promise<any> {
      try{
          const hashedPassword = await hashPassword(password);
          if(!hashPassword){
            throw new Error("error while hashing password")
          }
          const response  = await this.__authRepository.updatePassword(hashedPassword,userId)
         return  response    
      }catch(err){
            throw err
      }
  }
}