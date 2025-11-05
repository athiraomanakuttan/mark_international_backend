import mongoose from "mongoose";


export interface IUser {
    _id ?: mongoose.Types.ObjectId;
    name: string;
    phoneNumber: string;
    password: string;
    designation: string;
    email?: string;
    accessibleUsers?: number[];
    profilePic?: File | null;
    openingBalance?: number;
    role: "admin" | "staff";
    joiningDate?: Date;
    createdAt?: Date;
    updatedAt?: Date;
    isActive?:  number; // 1 for active, 0 for inactive, -1 for deleted
}

export interface IBranch {
    _id?: mongoose.Types.ObjectId;
    branchName: string;
    location: string;
    description: string;
    createdAt?: Date;
    updatedAt?: Date;
    isActive?: number; // 1 for active, 0 for inactive, -1 for deleted
}