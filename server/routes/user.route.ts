import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware";
import reqBodyMiddleware from "../middleware/reqBody.middleware";
import fetchProfileController from "../controllers/user/fetch.controller";
import updateProfileController from "../controllers/user/update.controller";
import deleteProfileController from "../controllers/user/delete.controller";

const router = Router();

router.use(authMiddleware);

router.get("/profile", fetchProfileController);
router.patch("/profile", reqBodyMiddleware, updateProfileController);
router.delete("/profile", deleteProfileController);

export default router;
