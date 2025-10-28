import { Request,Response } from "express"
import { STATUS_CODE } from "../../constance/statusCode"
import { MESSAGE_CONST } from "../../constant/MessageConst"
import { IAuthService } from "../../service/interface/IAuthService"
import { CustomRequestType } from "../../types/requestType"
class ProfileController{
    private __authService:IAuthService
    constructor(authService:IAuthService){
        this.__authService= authService
    }

    async changePassword(req:CustomRequestType, res:Response): Promise<void>{
        try {
            const userId =  req.user?.id
            const {password} = req.body
            if(!userId){
                res.status(STATUS_CODE.UNAUTHORIZED).json({status: false, message:MESSAGE_CONST.UNAUTHORIZED})
                return
            }
            if(!password){
                res.status(STATUS_CODE.BAD_REQUEST).json({status: false, message:MESSAGE_CONST.BAD_REQUEST})
                return
            }
            const response = await this.__authService.resetPassword(password,userId)
            if(response){
                res.status(STATUS_CODE.OK).json({status: true, message: MESSAGE_CONST.SUCCESS})
                return
            }
            res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({status: false, message: MESSAGE_CONST.INTERNAL_SERVER_ERROR})
        } catch (error) {
            res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({status: false, message:MESSAGE_CONST.INTERNAL_SERVER_ERROR})
        }
    }
}

export default ProfileController