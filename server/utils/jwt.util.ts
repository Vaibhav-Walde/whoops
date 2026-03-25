import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRY_TIME } from "../config/constants.config";
import { AuthTokenPayload, DecodeResult } from "./types/common.types";

const generateAuthToken = (tokenPayload: { id: string; role: string }) => {
  const payload = {
    id: tokenPayload.id,
    role: tokenPayload.role,
  };
  const secretKey = JWT_SECRET!;
  const options: jwt.SignOptions = {
    expiresIn: JWT_EXPIRY_TIME,
  };

  return jwt.sign(payload, secretKey, options);
};

const decodeAuthToken = (token: string): DecodeResult => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload & AuthTokenPayload;

    if (!decoded.id || !decoded.role) {
      return { success: false, token: null };
    }

    return {
      success: true,
      token: { id: decoded.id, role: decoded.role },
    };
  } catch {
    return { success: false, token: null };
  }
};
export { generateAuthToken, decodeAuthToken };
