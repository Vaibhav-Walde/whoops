import { Request, Response, NextFunction } from "express";
import deleteProfileService from "../../services/user/delete.service";

const deleteProfileController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    await deleteProfileService(userId);
    res.status(200).json({ success: true, message: "Account deleted" });
  } catch (err) {
    next(err);
  }
};

export default deleteProfileController;
