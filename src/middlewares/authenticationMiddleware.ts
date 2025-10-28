import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { UserAuthType } from "../types/authTypes";
import { CustomRequestType } from "../types/requestType";

// Use Express' RequestHandler so this middleware is compatible with Router.use
const authenticationMiddleware: RequestHandler = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET as string);
        if (typeof decoded === "string") {
            console.error("Decoded token is a string, expected an object");
            res.status(401).json({ message: "Invalid token payload" });
            return;
        }
        // checking token expiration
        if (decoded.exp && decoded.exp < Date.now() / 1000) {
            console.error("Token has expired");
            res.status(401).json({ message: "Token expired" });
            return;
        }

        // attach user to request using project CustomRequestType
        (req as CustomRequestType).user = decoded as UserAuthType;
        next();
    } catch (error) {
        console.error("Authentication error:", error);
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
};

export default authenticationMiddleware;
