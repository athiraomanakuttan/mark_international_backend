import { UserAuthType } from "./authTypes";
import { Request } from "express";

export interface CustomRequestType extends Request {
    user?: UserAuthType;
}