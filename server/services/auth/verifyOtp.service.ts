import logger from "../../config/logger.config";
import redis from "../../config/redis.config";
import { ApiError, handleServerError } from "../../utils/error.utils";

type VerifyOtpInput = {
  email: string;
  otp: string;
};

const verifyOtpService = async ({ email, otp }: VerifyOtpInput): Promise<boolean | void> => {
  try {
    const storedOtp = await redis.get(`otp:${email}`);
    if (!storedOtp) {
      throw new ApiError(400, "OTP expired or not found");
    }

    logger.debug(`Entered OTP: ${otp} Stored OTP: ${storedOtp}`);
    if (storedOtp !== otp) {
      throw new ApiError(400, "Invalid OTP");
    }

    await redis.del(`otp:${email}`);
    logger.success(`OTP verified successfully for ${email}`);
    return true;
  } catch (err) {
    logger.error(
      "Error in verifyOtpService: " + (err instanceof Error ? err.message : String(err))
    );
    handleServerError(err instanceof Error ? err : new Error(String(err)));
  }
};

export default verifyOtpService;
