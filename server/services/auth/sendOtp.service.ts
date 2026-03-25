import logger from "../../config/logger.config";
import redis from "../../config/redis.config";
import { findUserByEmail } from "../../repositories/user/user.repository";
import { ApiError, handleServerError } from "../../utils/error.utils";
import { sendMail } from "../../utils/mail.util";
import { generateOtp } from "../../utils/otp.util";
import { getOtpEmailTemplate } from "../../utils/otp.util";

const sendOtpService = async ({ email, isSignup }: { email: string; isSignup: boolean }) => {
  try {
    const existingUser = await findUserByEmail(email);

    if (existingUser && isSignup) {
      throw new ApiError(400, "A user with this email exists.");
    }

    if (!existingUser && !isSignup) {
      throw new ApiError(404, "No user found with this email.");
    }

    const otp = generateOtp();

    const html = getOtpEmailTemplate(otp);

    await redis.set(`otp:${email}`, otp, "EX", 600);

    await sendMail({
      to: email,
      subject: "Your OTP Code",
      html,
    });
    logger.success(`OTP sent to ${email} successfully`);
    return;
  } catch (err) {
    logger.error("Error in sendOtpService " + (err instanceof Error ? err.message : String(err)));
    handleServerError(err instanceof Error ? err : new Error(String(err)));
  }
};

export default sendOtpService;
