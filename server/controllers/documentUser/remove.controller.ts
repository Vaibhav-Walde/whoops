import removeDocumentUserService from "../../services/documentUser/remove.service";
import { ParamsController } from "../../utils/types/express.types";

type RemoveDocumentUserParams = {
  documentId: string;
  documentUserId: string;
};

const removeDocumentUserController: ParamsController<RemoveDocumentUserParams> = async (
  req,
  res,
  next
) => {
  try {
    const { documentId, documentUserId } = req.params;

    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    await removeDocumentUserService(documentId, userId, documentUserId);

    res.status(200).json({
      success: true,
      message: `User removed successfully`,
    });
  } catch (err) {
    next(err);
  }
};

export default removeDocumentUserController;
