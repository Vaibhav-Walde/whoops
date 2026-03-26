import { Router } from "express";
import authRoutes from "./auth.route";
import documentRoutes from "./document.route";
import healthRoutes from "./health.route";
import userRoutes from "./user.route";
import aiRoutes from "./ai.route";

const router = Router();

router.use("/auth", authRoutes);
router.use("/document", documentRoutes);
router.use("/health", healthRoutes);
router.use("/user", userRoutes);
router.use("/ai", aiRoutes);

export default router;