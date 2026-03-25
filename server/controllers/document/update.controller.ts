import updateDocumentService from "../../services/document/update.service";
import { BodyParamsController } from "../../utils/types/express.types";

type UpdateDocumentBody = {
  title?: string;
  description?: string;
};

type UpdateDocumentParams = {
  id: string;
};

const updateDocumentController: BodyParamsController<
  UpdateDocumentBody,
  UpdateDocumentParams
> = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const { title, description } = req.body;

    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }
    if (!title && description === undefined) {
      res.status(400).json({ success: false, message: "Nothing to update" });
      return;
    }

    const document = await updateDocumentService(id, userId, {
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
    });
    res.status(200).json({ success: true, document });
  } catch (err) {
    next(err);
  }
};

export default updateDocumentController;
