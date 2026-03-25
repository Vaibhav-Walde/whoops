import { BodyController } from "../../utils/types/express.types";
import emailAuthService from "../../services/auth/emailAuth.service";

type EmailAuthBody = {
  name?: string;
  email: string;
  otp: string;
  isSignup: boolean;
};

const emailAuthController: BodyController<EmailAuthBody> = async (req, res, next) => {
  try {
    const { name, email, otp, isSignup } = req.body;
    const data = await emailAuthService({ ...(name && { name }), email, otp, isSignup });

    res.status(200).json({
      success: true,
      message: isSignup ? "Account created successfully" : "Logged in successfully",
      data,
    });
  } catch (err) {
    next(err);
  }
};

export default emailAuthController;
