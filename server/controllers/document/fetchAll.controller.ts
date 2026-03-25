import fetchAllDocumentService from "../../services/document/fetchAll.service";
import { Controller } from "../../utils/types/express.types";

const fetchAllDocumentController: Controller = async (req, res, next) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }
    const documents = await fetchAllDocumentService(userId);

    res.status(200).json({
      success: true,
      message: "User registered successfully",
      documents,
    });
  } catch (err) {
    next(err);
  }
};

export default fetchAllDocumentController;
