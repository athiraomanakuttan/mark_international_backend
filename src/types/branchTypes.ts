import { IBranch } from "./modelTypes";

export interface CreateBranchType {
  branchName: string;
  location: string;
  description: string;
}

export interface BranchResponseType {
  status: boolean;
  message: string;
  data: IBranch;
}

export interface BranchListResponse {
  status: boolean;
  message: string;
  data: {
    branches: IBranch[];
    total: number;
    page: number;
    limit: number;
  };
}