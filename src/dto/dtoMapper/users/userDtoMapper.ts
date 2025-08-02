import { IUser } from "../../../types/modelTypes";
import {  UserData } from '../../dtoTypes/users/usersDto'; 

export const mapUserToDto = (user: IUser): UserData => {
  return {
    id: user?._id!.toString(),
    name: user.name,
    phoneNumber: user.phoneNumber,
    designation: user.designation,
    isAdmin: user.role === 'admin',
    status:user.isActive || -1,
    role: user.role,
  };
};

export const mapUsersToDto = (students: IUser[]): UserData[] => {
  return students.map(mapUserToDto);
};