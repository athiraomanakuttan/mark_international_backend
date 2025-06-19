import { loginType } from "../../types/authTypes";

export interface IAuthService {
  login(data: loginType): Promise<string>;  
}