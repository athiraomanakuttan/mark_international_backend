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
    joiningDate?: Date | string
    profilePic?: string | null;
    branchId?: string;
    branchName?: string;
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