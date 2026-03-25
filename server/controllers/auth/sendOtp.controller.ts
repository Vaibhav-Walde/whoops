import { BodyController } from "../../utils/types/express.types";
import sendOtpService from "../../services/auth/sendOtp.service";

type SendOtpBody = {
  email: string;
  isSignup: boolean;
};

const sendOtpController: BodyController<SendOtpBody> = async (req, res, next) => {
  try {
    const { email, isSignup } = req.body;
    await sendOtpService({ email, isSignup });

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (err) {
    next(err);
  }
};

export default sendOtpController;
