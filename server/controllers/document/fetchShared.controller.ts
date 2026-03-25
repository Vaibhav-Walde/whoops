import { Controller } from "../../utils/types/express.types";
import fetchSharedDocumentsService from "../../services/document/fetchShared.service";

const fetchSharedDocumentsController: Controller = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const documents = await fetchSharedDocumentsService(userId);
    res.status(200).json({ success: true, documents });
  } catch (err) {
    next(err);
  }
};

export default fetchSharedDocumentsController;
