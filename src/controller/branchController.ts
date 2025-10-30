import { IBranchService } from "../service/interface/IBranchService";
import { Request, Response } from "express";
import { STATUS_CODE } from "../constance/statusCode";
import { CreateBranchType } from "../types/branchTypes";
import { MESSAGE_CONST } from "../constant/MessageConst";

class BranchController {
  private __branchService: IBranchService;

  constructor(branchService: IBranchService) {
    this.__branchService = branchService;
  }

  async createBranch(req: Request, res: Response): Promise<void> {
    try {
      const branchData: CreateBranchType = req.body;
      
      if (!branchData || !branchData.branchName || !branchData.location || !branchData.description) {
        res
          .status(STATUS_CODE.BAD_REQUEST)
          .json({ 
            status: false, 
            message: "Branch name, location, and description are required" 
          });
        return;
      }

      const createdBranch = await this.__branchService.createBranch(branchData);
      
      res
        .status(STATUS_CODE.CREATED)
        .json({
          status: true,
          message: "Branch created successfully",
          data: createdBranch,
        });
    } catch (err: any) {
      if (err.code === 11000) {
        res
          .status(STATUS_CODE.BAD_REQUEST)
          .json({ 
            status: false, 
            message: "Branch with this name already exists" 
          });
        return;
      }
      
      res
        .status(STATUS_CODE.INTERNAL_SERVER_ERROR)
        .json({ 
          status: false, 
          message: err.message || "Failed to create branch" 
        });
    }
  }

  async getBranches(req: Request, res: Response): Promise<void> {
    try {
      const { page = 1, limit = 10, status = 1, search } = req.query;
      
      const branches = await this.__branchService.getAllBranches(
        Number(page),
        Number(limit),
        Number(status),
        search as string
      );
      
      res
        .status(STATUS_CODE.OK)
        .json({
          status: true,
          message: "Branches fetched successfully",
          data: {
            branches: branches.branches,
            total: branches.total,
            totalPages: branches.totalPages,
            currentPage: branches.currentPage,
            hasNext: branches.hasNext,
            hasPrev: branches.hasPrev,
            page: Number(page),
            limit: Number(limit)
          },
        });
    } catch (err: any) {
      res
        .status(STATUS_CODE.INTERNAL_SERVER_ERROR)
        .json({ 
          status: false, 
          message: err.message || "Failed to fetch branches" 
        });
    }
  }

  async getBranchById(req: Request, res: Response): Promise<void> {
    try {
      const { branchId } = req.params;
      
      if (!branchId) {
        res
          .status(STATUS_CODE.BAD_REQUEST)
          .json({ 
            status: false, 
            message: "Branch ID is required" 
          });
        return;
      }

      const branch = await this.__branchService.getBranchById(branchId);
      
      if (!branch) {
        res
          .status(STATUS_CODE.NOT_FOUND)
          .json({ 
            status: false, 
            message: "Branch not found" 
          });
        return;
      }
      
      res
        .status(STATUS_CODE.OK)
        .json({
          status: true,
          message: "Branch fetched successfully",
          data: branch,
        });
    } catch (err: any) {
      res
        .status(STATUS_CODE.INTERNAL_SERVER_ERROR)
        .json({ 
          status: false, 
          message: err.message || "Failed to fetch branch" 
        });
    }
  }

  async updateBranch(req: Request, res: Response): Promise<void> {
    try {
      const { branchId } = req.params;
      const branchData: Partial<CreateBranchType> = req.body;
      
      if (!branchId) {
        res
          .status(STATUS_CODE.BAD_REQUEST)
          .json({ 
            status: false, 
            message: "Branch ID is required" 
          });
        return;
      }

      const updatedBranch = await this.__branchService.updateBranch(branchId, branchData);
      
      if (!updatedBranch) {
        res
          .status(STATUS_CODE.NOT_FOUND)
          .json({ 
            status: false, 
            message: "Branch not found" 
          });
        return;
      }
      
      res
        .status(STATUS_CODE.OK)
        .json({
          status: true,
          message: "Branch updated successfully",
          data: updatedBranch,
        });
    } catch (err: any) {
      res
        .status(STATUS_CODE.INTERNAL_SERVER_ERROR)
        .json({ 
          status: false, 
          message: err.message || "Failed to update branch" 
        });
    }
  }

  async updateBranchStatus(req: Request, res: Response): Promise<void> {
    try {
      const { branchId } = req.params;
      const { status } = req.body;
      
      if (!branchId) {
        res
          .status(STATUS_CODE.BAD_REQUEST)
          .json({ 
            status: false, 
            message: "Branch ID is required" 
          });
        return;
      }

      if (![0, 1, -1].includes(Number(status))) {
        res
          .status(STATUS_CODE.BAD_REQUEST)
          .json({ 
            status: false, 
            message: "Status must be 0 (inactive), 1 (active), or -1 (deleted)" 
          });
        return;
      }

      const updatedBranch = await this.__branchService.updateBranchStatus(branchId, Number(status));
      
      if (!updatedBranch) {
        res
          .status(STATUS_CODE.NOT_FOUND)
          .json({ 
            status: false, 
            message: "Branch not found" 
          });
        return;
      }
      
      res
        .status(STATUS_CODE.OK)
        .json({
          status: true,
          message: "Branch status updated successfully",
          data: updatedBranch,
        });
    } catch (err: any) {
      res
        .status(STATUS_CODE.INTERNAL_SERVER_ERROR)
        .json({ 
          status: false, 
          message: err.message || "Failed to update branch status" 
        });
    }
  }

  async searchBranches(req: Request, res: Response): Promise<void> {
    try {
      const { page = 1, limit = 10, status, query } = req.query;
      
      if (!query || (query as string).trim() === '') {
        res
          .status(STATUS_CODE.BAD_REQUEST)
          .json({ 
            status: false, 
            message: "Search query is required" 
          });
        return;
      }

      const branches = await this.__branchService.searchBranches(
        query as string,
        Number(page),
        Number(limit),
        status ? Number(status) : undefined
      );
      
      res
        .status(STATUS_CODE.OK)
        .json({
          status: true,
          message: "Branch search completed successfully",
          data: {
            branches: branches.branches,
            total: branches.total,
            totalPages: branches.totalPages,
            currentPage: branches.currentPage,
            hasNext: branches.hasNext,
            hasPrev: branches.hasPrev,
            searchQuery: query,
            page: Number(page),
            limit: Number(limit)
          },
        });
    } catch (err: any) {
      res
        .status(STATUS_CODE.INTERNAL_SERVER_ERROR)
        .json({ 
          status: false, 
          message: err.message || "Failed to search branches" 
        });
    }
  }

  async deleteBranch(req: Request, res: Response): Promise<void> {
    try {
      const { branchId } = req.params;
      
      if (!branchId) {
        res
          .status(STATUS_CODE.BAD_REQUEST)
          .json({ 
            status: false, 
            message: "Branch ID is required" 
          });
        return;
      }

      const deletedBranch = await this.__branchService.deleteBranch(branchId);
      
      if (!deletedBranch) {
        res
          .status(STATUS_CODE.NOT_FOUND)
          .json({ 
            status: false, 
            message: "Branch not found or already deleted" 
          });
        return;
      }
      
      res
        .status(STATUS_CODE.OK)
        .json({
          status: true,
          message: "Branch deleted successfully",
          data: deletedBranch,
        });
    } catch (err: any) {
      res
        .status(STATUS_CODE.INTERNAL_SERVER_ERROR)
        .json({ 
          status: false, 
          message: err.message || "Failed to delete branch" 
        });
    }
  }
}

export default BranchController;