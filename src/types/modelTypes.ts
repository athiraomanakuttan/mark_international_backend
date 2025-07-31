

export interface IUser {
    _id ?: string;
    name: string;
    phoneNumber: string;
    password: string;
    designation: string;
    email?: string;
    accessibleUsers?: number[];
    profilePic?: File | null;
    openingBalance?: number;
    role: "admin" | "staff";
    createdAt?: Date;
    updatedAt?: Date;
    isActive?:  number; // 1 for active, 0 for inactive, -1 for deleted
}