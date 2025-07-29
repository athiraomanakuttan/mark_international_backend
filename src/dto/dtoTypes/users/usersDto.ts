export interface UserData{
    id: string
    name:  string
    phoneNumber: string
    designation: string
    isAdmin: boolean
    role: string
}

export interface IUserDto{
     status?: boolean;
        message?: string;
        user ?: UserData,
        accessToken ?: string;
        refreshToken ?: string;
}