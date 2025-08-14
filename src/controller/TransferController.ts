import { STATUS_CODE } from "../constance/statusCode";
import { MESSAGE_CONST } from "../constant/MessageConst";
import { ITransferLeadService } from "../service/interface/ITransferLeadService";
import { Request, Response } from "express";
export class TransferController{
private _transferService:ITransferLeadService
constructor(transferLeadService: ITransferLeadService){
    this._transferService = transferLeadService
}

async getTransferList(req:Request, res:Response):Promise<void>{
    try{
                  const {
  page = "1",
  limit = "10",
  filter = "",
  search = ""
} = req.query as {
  page?: string;
  limit?: string;
  filter?: string;
  search?: string;
};
        const filterdata = JSON.parse(filter)
        const response = await this._transferService.getTransferList(Number(page),Number(limit), filterdata,String(search))
        if(response){
            res.status(STATUS_CODE.OK).json({status:true, message:MESSAGE_CONST.SUCCESS, data:response})
        }
    }catch(err){
        res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({status:false, Message:MESSAGE_CONST.INTERNAL_SERVER_ERROR})
    }
}

}