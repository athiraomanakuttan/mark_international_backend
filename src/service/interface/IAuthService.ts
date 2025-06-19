import { loginType, serviceLoginResponse } from "../../types/authTypes";

export interface IAuthService {
  login(data: loginType): Promise<serviceLoginResponse | null>;  
}