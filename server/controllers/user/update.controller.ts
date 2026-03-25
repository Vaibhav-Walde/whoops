import { Request, Response, NextFunction } from "express";
import updateProfileService from "../../services/user/update.service";

const updateProfileController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const { name } = req.body;

    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const user = await updateProfileService(userId, name.trim());
    res.status(200).json({ success: true, message: "Profile updated successfully", user });
  } catch (err) {
    next(err);
  }
};

export default updateProfileController;
