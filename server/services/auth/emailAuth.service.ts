import logger from "../../config/logger.config";
import { findUserByEmail, insertUser } from "../../repositories/user/user.repository";
import { ApiError, handleServerError } from "../../utils/error.utils";
import { generateAuthToken } from "../../utils/jwt.util";
import verifyOtpService from "./verifyOtp.service";

type EmailAuthInput = {
  name?: string;
  email: string;
  otp: string;
  isSignup: boolean;
};

type EmailAuthOutput = {
  name: string;
  email: string;
  token: string;
};

const emailAuthService = async ({
  name,
  email,
  otp,
  isSignup,
}: EmailAuthInput): Promise<EmailAuthOutput | void> => {
  try {
    const isValidOtp = await verifyOtpService({ email, otp });
    if (!isValidOtp) {
      throw new ApiError(400, "Invalid OTP");
    }

    if (isSignup && !name) {
      throw new ApiError(400, "Name is required");
    }

    let currentUser = await findUserByEmail(email);

    if (isSignup && !currentUser) {
      if (!name) {
        throw new ApiError(400, "Name is required");
      }
      currentUser = await insertUser({
        name,
        email,
        provider: "EMAIL",
      });
    }

    if (!currentUser) {
      throw new ApiError(404, "User not found");
    }

    const token = generateAuthToken({
      id: currentUser.id,
      role: currentUser.role,
    });

    logger.success(`${name} registered via email successfully`);

    return {
      token,
      name: currentUser.name,
      email: currentUser.email,
    };
  } catch (err) {
    logger.error(
      "Error in emailAuthService: " + (err instanceof Error ? err.message : String(err))
    );
    handleServerError(err instanceof Error ? err : new Error(String(err)));
  }
};

export default emailAuthService;
