import logger from "../../config/logger.config";
import { findDocumentById } from "../../repositories/document/document.repository";
import {
  deleteDocumentUser,
  findDocumentUser,
} from "../../repositories/document/documentUser.repository";
import { ApiError, handleServerError } from "../../utils/error.utils";

const removeDocumentUserService = async (
  documentId: string,
  userId: string,
  documentUserId: string
): Promise<boolean | void> => {
  try {
    if (!documentId.trim()) {
      throw new ApiError(400, "Document ID is required");
    }

    const document = await findDocumentById(documentId);
    if (!document) {
      throw new ApiError(404, "Document not found");
    }

    if (document.ownerId !== userId) {
      throw new ApiError(403, "You don't have the permission");
    }

    const documentUser = await findDocumentUser(documentId, documentUserId);
    if (!documentUser) {
      throw new ApiError(404, "User not found");
    }

    await deleteDocumentUser(documentId, documentUserId);
    logger.success(`Document user: ${documentUser.user.name} removed from ${document.title}`);
    return true;
  } catch (err) {
    logger.error(
      "Error in removeDocumentUserService: " + (err instanceof Error ? err.message : String(err))
    );
    handleServerError(err instanceof Error ? err : new Error(String(err)));
  }
};

export default removeDocumentUserService;
