import createDocumentService from "../../services/document/create.service";
import { CreateDocumentInput } from "../../utils/types/common.types";
import { BodyController } from "../../utils/types/express.types";

const createDocumentController: BodyController<CreateDocumentInput> = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const ownerId = req.user?.id;

    if (!ownerId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const document = await createDocumentService({
      title,
      ownerId,
      description: description ?? null,
    });

    res.status(201).json({
      success: true,
      message: "Document created successfully",
      document,
    });
  } catch (err) {
    next(err);
  }
};

export default createDocumentController;
