import { UserAuthType } from "./authTypes";

export interface CustomRequestType extends Request {
    user?: UserAuthType;
}