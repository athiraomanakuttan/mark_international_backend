import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken"; // Note: use lowercase `jwt`
import { UserAuthType } from "../types/authTypes";

// Extend Request type to include `user` property
interface AuthenticatedRequest extends Request {
    user?: UserAuthType; // You can replace `any` with a more specific type if needed
}

const authenticationMiddleware = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET as string);
        if (typeof decoded === "string") {
            console.error("Decoded token is a string, expected an object");
            return res.status(401).json({ message: "Invalid token payload" });
        }
        //checking token is expires or not
        if (decoded.exp && decoded.exp < Date.now() / 1000) {
            console.error("Token has expired");
            return res.status(401).json({ message: "Token expired" });
        }
        req.user = decoded as UserAuthType;
        
        next();
    } catch (error) {
        console.error("Authentication error:", error);
        return res.status(401).json({ message: "Unauthorized" });
    }
};

export default authenticationMiddleware;
