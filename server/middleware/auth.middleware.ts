import { NextFunction, Request, Response } from "express";
import logger from "../config/logger.config";
import { findUserById } from "../repositories/user/user.repository";
import { decodeAuthToken } from "../utils/jwt.util";

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const headerToken = req.headers.authorization?.split(" ")[1];
    const cookieToken = req.cookies?.token;
    const token = headerToken || cookieToken;

    if (!token) {
      logger.error("Unauthorized - Token missing");
      res.status(401).json({ success: false, message: "Unauthorized - Token missing" });
      return;
    }

    const decoded = await decodeAuthToken(token);

    if (!decoded || !decoded?.success) {
      logger.error("Unauthorized - Invalid token");
      res.status(401).json({ success: false, message: "Unauthorized - Invalid token" });
      return;
    }

    if (!decoded.token) {
      logger.error("Unauthorized - Invalid token");
      res.status(401).json({ success: false, message: "Unauthorized - Invalid token" });
      return;
    }

    const user = await findUserById(decoded.token.id);

    if (!user) {
      logger.error("Unauthorized - User not found");
      res.status(401).json({ success: false, message: "Unauthorized - User not found" });
      return;
    }
    logger.debug(`Current user: ${user.name} with role ${decoded.token.role}`);

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: "Unauthorized - Token error" });
  }
};

export default authMiddleware;
