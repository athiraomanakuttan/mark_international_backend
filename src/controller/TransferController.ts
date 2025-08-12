import { ITransferLeadService } from "../service/interface/ITransferLeadService";
import { Request, Response } from "express";
export class TransferController{
private _transferService:ITransferLeadService
constructor(transferLeadService: ITransferLeadService){
    this._transferService = transferLeadService
}


}