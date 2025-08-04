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

export interface StaffUpdateType {
    name?: string,
    phoneNumber?: string,
    email?: string,
    password?: string,
    designation?: string,
    profilePic?: string | File | null,
    accessibleUsers?: number[],
    openingBalance?: number,
    role?: string,
    isActive?: number,
};
