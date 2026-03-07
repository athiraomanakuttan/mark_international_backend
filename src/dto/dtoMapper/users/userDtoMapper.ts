import { IUser } from "../../../types/modelTypes";
import { UserData } from '../../dtoTypes/users/usersDto'; 

export const mapUserToDto = (user: any): UserData => {
  return {
    id: user?._id!.toString(),
    name: user.name,
    email: user.email,
    phoneNumber: user.phoneNumber,
    designation: user.designation,
    isAdmin: user.role === 'admin',
    status: user.isActive || -1,
    createdAt: user.createdAt,
    joiningDate: user.joiningDate,
    role: user.role,
    profilePic: typeof user.profilePic === 'string' ? user.profilePic : null,
    branchId: user.branchId,
    branchName: user.branchId && user.branchId.branchName ? user.branchId.branchName : undefined,
  };
};

export const mapUsersToDto = (users: any[]): UserData[] => {
  return users.map(mapUserToDto);
};