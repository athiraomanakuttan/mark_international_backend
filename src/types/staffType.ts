export interface StaffBasicType {
    name: string,
    phoneNumber: string,
    password: string,
    email ?: string,
    designation: string,
    profilePic?:  string| File | null,
    accessibleUsers?: number[];
    openingBalance?: number;
    role: string,
    isActive: number,
};