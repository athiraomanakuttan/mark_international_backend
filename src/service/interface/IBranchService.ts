import { CreateBranchType, BranchResponseType, BranchListResponse } from "../../types/branchTypes";
import { IBranch } from "../../types/modelTypes";

export interface IBranchService {
  createBranch(branchData: CreateBranchType): Promise<IBranch>;
  getBranchById(branchId: string): Promise<IBranch | null>;
  getAllBranches(
    page: number, 
    limit: number, 
    status: number, 
    search?: string
  ): Promise<{
    branches: IBranch[];
    total: number;
    totalPages: number;
    currentPage: number;
    hasNext: boolean;
    hasPrev: boolean;
  }>;
  updateBranch(branchId: string, branchData: Partial<CreateBranchType>): Promise<IBranch | null>;
  updateBranchStatus(branchId: string, status: number): Promise<IBranch | null>;
  searchBranches(
    searchQuery: string,
    page: number,
    limit: number,
    status?: number
  ): Promise<{
    branches: IBranch[];
    total: number;
    totalPages: number;
    currentPage: number;
    hasNext: boolean;
    hasPrev: boolean;
  }>;
  deleteBranch(branchId: string): Promise<IBranch | null>;
}