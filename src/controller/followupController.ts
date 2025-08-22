import { IFollowupService } from "../service/interface/IFollowupService";
import { FollowUpType } from "../types/followupType";

import { Request, Response } from "express";
import { CustomRequestType } from "../types/requestType";
export class FollowupController {
  private __followupService: IFollowupService;
  constructor(followupService: IFollowupService) {
    this.__followupService = followupService;
  }

  async createFollowup(req: Request, res: Response): Promise<void> {
      const data: FollowUpType = req.body;
      const result = await this.__followupService.createFollowup(data);
      res.json(result);
    }}
