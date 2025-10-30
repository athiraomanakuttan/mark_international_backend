import { IBranchService } from "./interface/IBranchService";
import { IBranchRepository } from "../repository/interface/IBranchRepository";
import { CreateBranchType } from "../types/branchTypes";
import { IBranch } from "../types/modelTypes";

export class BranchService implements IBranchService {
  private __branchRepository: IBranchRepository;

  constructor(branchRepository: IBranchRepository) {
    this.__branchRepository = branchRepository;
  }

  async createBranch(branchData: CreateBranchType): Promise<IBranch> {
    try {
      // Validate required fields
      if (!branchData.branchName || !branchData.location || !branchData.description) {
        throw new Error("Branch name, location, and description are required");
      }

      return await this.__branchRepository.createBranch(branchData);
    } catch (error) {
      throw error;
    }
  }

  async getBranchById(branchId: string): Promise<IBranch | null> {
    try {
      if (!branchId) {
        throw new Error("Branch ID is required");
      }
      return await this.__branchRepository.getBranchById(branchId);
    } catch (error) {
      throw error;
    }
  }

  async getAllBranches(
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
  }> {
    try {
      if (page <= 0 || limit <= 0) {
        throw new Error("Page and limit must be positive numbers");
      }
      
      const result = await this.__branchRepository.getAllBranches(page, limit, status, search);
      const totalPages = Math.ceil(result.total / limit);
      
      return {
        branches: result.branches,
        total: result.total,
        totalPages,
        currentPage: page,
        hasNext: page < totalPages,
        hasPrev: page > 1
      };
    } catch (error) {
      throw error;
    }
  }

  async updateBranch(branchId: string, branchData: Partial<CreateBranchType>): Promise<IBranch | null> {
    try {
      if (!branchId) {
        throw new Error("Branch ID is required");
      }
      if (!branchData || Object.keys(branchData).length === 0) {
        throw new Error("Branch data is required for update");
      }
      return await this.__branchRepository.updateBranch(branchId, branchData);
    } catch (error) {
      throw error;
    }
  }

  async updateBranchStatus(branchId: string, status: number): Promise<IBranch | null> {
    try {
      if (!branchId) {
        throw new Error("Branch ID is required");
      }
      if (![0, 1, -1].includes(status)) {
        throw new Error("Status must be 0 (inactive), 1 (active), or -1 (deleted)");
      }
      return await this.__branchRepository.updateBranchStatus(branchId, status);
    } catch (error) {
      throw error;
    }
  }

  async searchBranches(
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
  }> {
    try {
      if (!searchQuery || searchQuery.trim() === '') {
        throw new Error("Search query is required");
      }
      if (page <= 0 || limit <= 0) {
        throw new Error("Page and limit must be positive numbers");
      }
      
      const result = await this.__branchRepository.searchBranches(searchQuery, page, limit, status);
      const totalPages = Math.ceil(result.total / limit);
      
      return {
        branches: result.branches,
        total: result.total,
        totalPages,
        currentPage: page,
        hasNext: page < totalPages,
        hasPrev: page > 1
      };
    } catch (error) {
      throw error;
    }
  }

  async deleteBranch(branchId: string): Promise<IBranch | null> {
    try {
      if (!branchId) {
        throw new Error("Branch ID is required");
      }

      // Check if branch exists before attempting to delete
      const existingBranch = await this.__branchRepository.getBranchById(branchId);
      if (!existingBranch) {
        throw new Error("Branch not found");
      }

      

      return await this.__branchRepository.deleteBranch(branchId);
    } catch (error) {
      throw error;
    }
  }
}