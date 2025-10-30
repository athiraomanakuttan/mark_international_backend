import { IBranchRepository } from "./interface/IBranchRepository";
import Branch from "../model/branchModel";
import { CreateBranchType } from "../types/branchTypes";
import { IBranch } from "../types/modelTypes";

export class BranchRepository implements IBranchRepository {
  async createBranch(branchData: CreateBranchType): Promise<IBranch> {
    try {
      const newBranch = new Branch(branchData);
      const savedBranch = await newBranch.save();
      return savedBranch.toObject();
    } catch (error) {
      throw error;
    }
  }

  async getBranchById(branchId: string): Promise<IBranch | null> {
    try {
      const branch = await Branch.findOne({ _id: branchId, isActive: { $ne: -1 } });
      return branch ? branch.toObject() : null;
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
  }> {
    try {
      const skip = (page - 1) * limit;
      let query: any = status === -1 ? {} : { isActive: status };
      
      // Add search functionality if search parameter is provided
      if (search && search.trim()) {
        const searchRegex = new RegExp(search.trim(), 'i');
        query = {
          ...query,
          $or: [
            { branchName: searchRegex },
            { location: searchRegex },
            { description: searchRegex }
          ]
        };
      }
      
      const [branches, total] = await Promise.all([
        Branch.find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        Branch.countDocuments(query)
      ]);

      return {
        branches,
        total
      };
    } catch (error) {
      throw error;
    }
  }

  async updateBranch(branchId: string, branchData: Partial<CreateBranchType>): Promise<IBranch | null> {
    try {
      const updatedBranch = await Branch.findOneAndUpdate(
        { _id: branchId, isActive: { $ne: -1 } },
        { $set: branchData },
        { new: true }
      );
      return updatedBranch ? updatedBranch.toObject() : null;
    } catch (error) {
      throw error;
    }
  }

  async updateBranchStatus(branchId: string, status: number): Promise<IBranch | null> {
    try {
      const updatedBranch = await Branch.findOneAndUpdate(
        { _id: branchId },
        { $set: { isActive: status } },
        { new: true }
      );
      return updatedBranch ? updatedBranch.toObject() : null;
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
  }> {
    try {
      const skip = (page - 1) * limit;
      const searchRegex = new RegExp(searchQuery.trim(), 'i');
      
      let query: any = {
        $or: [
          { branchName: searchRegex },
          { location: searchRegex },
          { description: searchRegex }
        ]
      };

      // Add status filter if provided
      if (status !== undefined && status !== -1) {
        query.isActive = status;
      } else if (status === undefined) {
        // Default to active branches if no status specified
        query.isActive = { $ne: -1 };
      }
      
      const [branches, total] = await Promise.all([
        Branch.find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        Branch.countDocuments(query)
      ]);

      return {
        branches,
        total
      };
    } catch (error) {
      throw error;
    }
  }

  async deleteBranch(branchId: string): Promise<IBranch | null> {
    try {
        const deletedBranch = await Branch.findOneAndDelete({ _id: branchId });
        return deletedBranch ? deletedBranch.toObject() : null;
      
    } catch (error) {
      throw error;
    }
  }
}