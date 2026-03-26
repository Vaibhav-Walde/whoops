import express from "express";
import asyncHandler from "express-async-handler";
import authMiddleware from "../middleware/auth.middleware";
import aiImproveService from "../services/ai/improve.service";

const router = express.Router();

router.post(
  "/improve",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const { text, action } = req.body;
    if (!text || !action) {
      res.status(400).json({ success: false, message: "Text and action are required" });
      return;
    }
    const result = await aiImproveService(text, action);
    res.status(200).json({ success: true, result });
  })
);

export default router;