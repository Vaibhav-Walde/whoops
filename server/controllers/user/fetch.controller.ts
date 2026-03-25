import { Request, Response, NextFunction } from "express";
import fetchProfileService from "../../services/user/fetch.service";

const fetchProfileController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const user = await fetchProfileService(userId);
    res.status(200).json({ success: true, message: "Profile fetched successfully", user });
  } catch (err) {
    next(err);
  }
};

export default fetchProfileController;
