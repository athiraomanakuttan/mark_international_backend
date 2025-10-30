import { CreateBranchType } from "../../types/branchTypes";
import { IBranch } from "../../types/modelTypes";

export interface IBranchRepository {
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
  }>;
  deleteBranch(branchId: string): Promise<IBranch | null>;
}