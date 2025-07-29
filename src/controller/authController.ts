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
        console.log("working")
        const { phoneNumber, password } = req.body;
        console.log("phoneNumber", phoneNumber, "password", password);
        if(!phoneNumber || !password) {
            res.status(STATUS_CODE.BAD_REQUEST).json({status: false, message: "Phone number and password are required", data: null});
            return }
        try {
            const data = await this.__authService.login({phoneNumber, password} as loginType);
            if(data?.status){
                //set refresh token in cookie
                res.cookie('refreshToken', data.refreshToken, {
                    httpOnly: true,
                    secure: false,
                    sameSite: 'none',  
                    maxAge: 7 * 24 * 60 * 60 * 1000
                });
                res.status(STATUS_CODE.OK).json({status: true, message: MESSAGE_CONST.LOGIN_SUCCESS, data: {user: data?.user, accessToken: data?.accessToken}});
                return
            }
            res.status(STATUS_CODE.UNAUTHORIZED).json({status: false, message: data?.message, data: null});
        } catch (error) {
            console.log("Error in userLogin:", error);
            res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({status: false, message: MESSAGE_CONST.INTERNAL_SERVER_ERROR, data: null});
        }
    

}
}