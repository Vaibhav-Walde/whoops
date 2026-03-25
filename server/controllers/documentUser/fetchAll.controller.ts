import fetchAllDocumentUserService from "../../services/documentUser/fetchAll.service";
import { ParamsController } from "../../utils/types/express.types";

type FetchAllDocumentUserParams = {
  id: string;
};

const fetchAllDocumentUserController: ParamsController<FetchAllDocumentUserParams> = async (
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

    const collaborators = await fetchAllDocumentUserService(documentId, userId);

    res.status(200).json({
      success: true,
      message: "Document users fetched successfully",
      collaborators,
    });
  } catch (err) {
    next(err);
  }
};

export default fetchAllDocumentUserController;
