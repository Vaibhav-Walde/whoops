import saveDocumentService from "../../services/document/save.service";
import { BodyParamsController } from "../../utils/types/express.types";

type SaveDocumentParams = {
  id: string;
};

type SaveDocumentBody = {
  content: string;
};

const saveDocumentController: BodyParamsController<SaveDocumentBody, SaveDocumentParams> = async (
  req,
  res,
  next
) => {
  try {
    const { id: documentId } = req.params;
    const userId = req.user?.id;
    const { content } = req.body;

    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    if (!content) {
      res.status(400).json({ success: false, message: "No content provided." });
      return;
    }

    const document = await saveDocumentService(documentId, userId, content);

    res.status(200).json({
      success: true,
      message: "Document saved successfully",
      document,
    });
  } catch (err) {
    next(err);
  }
};

export default saveDocumentController;
