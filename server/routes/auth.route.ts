import { Router } from "express";
import registerUserController from "../controllers/auth/register.controller";
import reqBodyMiddleware from "../middleware/reqBody.middleware";
import sendOtpController from "../controllers/auth/sendOtp.controller";
import emailAuthController from "../controllers/auth/emailAuth.controller";

const router = Router();

router.post("/register", reqBodyMiddleware, registerUserController);
router.post("/send-otp", reqBodyMiddleware, sendOtpController);
router.post("/email", reqBodyMiddleware, emailAuthController);

export default router;
