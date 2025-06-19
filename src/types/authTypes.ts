import { IUser } from "./modelTypes";

export interface loginType {
    phoneNumber: string;
    password: string;
}
export interface serviceLoginResponse {
    status?: boolean;
    message?: string;
    user ?: IUser,
    accessToken ?: string;
    refreshToken ?: string;
}