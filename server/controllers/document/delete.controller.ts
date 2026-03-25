import deleteDocumentService from "../../services/document/delete.service";
import { ParamsController } from "../../utils/types/express.types";

type DeleteDocumentParams = {
  id: string;
};

const deleteDocumentController: ParamsController<DeleteDocumentParams> = async (req, res, next) => {
  try {
    const { id: documentId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    await deleteDocumentService(documentId, userId);

    res.status(200).json({
      success: true,
      message: "Document deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

export default deleteDocumentController;
