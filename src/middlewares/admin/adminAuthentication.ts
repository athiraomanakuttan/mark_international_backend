import { UserAuthType } from "../../types/authTypes";
import { RequestHandler } from "express";
import { CustomRequestType } from "../../types/requestType";

export const adminAuthentication: RequestHandler = (req, res, next) => {
    try {
        const customReq = req as CustomRequestType;
        const user = customReq.user as UserAuthType;
        if (user && user.role === 'admin') {
            next();
        } else {
            res.status(403).json({ message: 'Forbidden: Admin access required' });
        }
    } catch (error) {
        console.error("Admin authentication error:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};