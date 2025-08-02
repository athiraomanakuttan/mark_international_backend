import { UserAuthType } from "../../types/authTypes";
import { Request, Response, NextFunction } from "express";
import { CustomRequestType } from "../../types/requestType";
export const adminAuthentication = (req: CustomRequestType, res: Response, next: NextFunction) => {
    try {
        const user = req.user as UserAuthType;
        if (user && user.role === 'admin') {
            next()
        } else {
            res.status(403).json({ message: 'Forbidden: Admin access required' });
        }
    } catch (error) {
        console.error("Admin authentication error:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
} 