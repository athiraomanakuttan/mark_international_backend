

export interface IUser {
    _id ?: string;
    name: string;
    phoneNumber: string;
    password: string;
    designation: string;
    email?: string;
    accessibleUsers?: string;
    staffImage?: File | null;
    openingBalance?: string;
    accessOfficialWhatsapp?: boolean;
    accessPhoneCallLog?: boolean;
    role: "admin" | "user";
    cretaedAt?: Date;
    updatedAt?: Date;
}