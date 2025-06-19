import { Request, Response } from "express";
import { IAuthService } from "../service/interface/IAuthService";
import { STATUS_CODE } from "../constant/statusConst";
import { MESSAGE_CONST } from "../constant/MessageConst";
import {loginType} from '../types/authTypes'

export class AuthController{
    private __authService : IAuthService
    constructor(authService: IAuthService){
        this.__authService = authService
    } 

    // staff and admin login try with phone number and passowrd
      async userLogin(req:Request, res:Response): Promise<void> {
        const { phoneNumber, password } = req.body;
        if(!phoneNumber || !password) {
            res.status(STATUS_CODE.BAD_REQUEST).json({status: false, message: "Phone number and password are required", data: null});
        try {
            const token = await this.__authService.login({phoneNumber, password} as loginType);
            res.status(200).json({ token });
        } catch (error) {
            res.status(401).json({status: false, message: MESSAGE_CONST.INTERNAL_SERVER_ERROR, data: null});
        }
    }

}
}