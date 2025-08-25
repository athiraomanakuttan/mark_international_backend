import { IFollowupService } from "../service/interface/IFollowupService";
import { FollowUpType } from "../types/followupType";

import { Request, Response } from "express";
import { CustomRequestType } from "../types/requestType";
import { STATUS_CODE } from "../constance/statusCode";
import { MESSAGE_CONST } from "../constant/MessageConst";
export class FollowupController {
  private __followupService: IFollowupService;
  constructor(followupService: IFollowupService) {
    this.__followupService = followupService;
  }

  async createFollowup(req: Request, res: Response): Promise<void> {
      const data: FollowUpType = req.body;
      const result = await this.__followupService.createFollowup(data);
      res.json(result);
    }

    async getAllFollowups(req: CustomRequestType, res: Response): Promise<void> {
      try{
        const id = req.user?.id
        const role = req.user?.role
      const result = await this.__followupService.getAllFollowups(role === 'admin' ? undefined : id);
      res.status(STATUS_CODE.OK).json({status: true, message:MESSAGE_CONST.SUCCESS, data: result });
      }catch(err){
        res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({status: false, message:MESSAGE_CONST.INTERNAL_SERVER_ERROR });
      }
    }

    async updateFollowup(req: CustomRequestType, res: Response): Promise<void> {
      try {
        const { followupIds }: { followupIds: string[] } = req.body;
        const role = req.user?.role
        const id = req.user?.id
        console.log("role", role, id)
        const response= await this.__followupService.updateFollowup(followupIds, role === 'admin' ? {isAdminDeleted: true} : {isDeleted: true});
        res.status(STATUS_CODE.OK).json({status: true, message:MESSAGE_CONST.SUCCESS, data: response });
      } catch (error) {
        res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({status: false, message:MESSAGE_CONST.INTERNAL_SERVER_ERROR });
      }
    }

  }


