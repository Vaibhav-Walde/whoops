import fetchOneDocumentService from "../../services/document/fetchOne.service";
import { ParamsController } from "../../utils/types/express.types";

type FetchOneDocumentParams = {
  id: string;
};

const fetchOneDocumentController: ParamsController<FetchOneDocumentParams> = async (
  req,
  res,
  next
) => {
  try {
    const { id: documentId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const document = await fetchOneDocumentService(documentId, userId);
    res.status(200).json({
      success: true,
      message: "Document fetched successfully",
      document: document,
    });
  } catch (err) {
    next(err);
  }
};

export default fetchOneDocumentController;
