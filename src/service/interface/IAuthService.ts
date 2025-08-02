import { IUserDto, UserData } from "../../dto/dtoTypes/users/usersDto";
import { loginType } from "../../types/authTypes";

export interface IAuthService {
  login(data: loginType): Promise<IUserDto | null>;  
}