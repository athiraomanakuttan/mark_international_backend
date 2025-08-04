export interface UserData{
    id: string
    name:  string
    phoneNumber: string
    email?:string,
    designation: string
    isAdmin: boolean
    role: string
    status : number
    createdAt?: Date
}

export interface IUserDto{
     status?: boolean;
        message?: string;
        user ?: UserData,
        accessToken ?: string;
        refreshToken ?: string;
}

export interface StaffResponse {
    users : UserData[],
    totalRecords: number
}