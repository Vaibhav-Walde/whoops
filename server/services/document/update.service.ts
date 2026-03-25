import { findDocumentById, updateDocument } from "../../repositories/document/document.repository";
import { ApiError, handleServerError } from "../../utils/error.utils";
import logger from "../../config/logger.config";
import { Doc } from "../../utils/types/common.types";

type UpdateDocumentRequest = {
  title?: string;
  description?: string;
};
const updateDocumentService = async (
  documentId: string,
  userId: string,
  data: UpdateDocumentRequest
): Promise<Doc | void> => {
  try {
    const document = await findDocumentById(documentId);
    if (!document) {
      throw new ApiError(404, "Document not found");
    }
    if (document.ownerId !== userId) {
      throw new ApiError(403, "Only the owner can update document details");
    }

    const updated = await updateDocument(documentId, data);
    logger.success(`Document name: ${updated.title} updated successfully`);
    return updated;
  } catch (err) {
    logger.error(
      "Error in updateDocumentService: " + (err instanceof Error ? err.message : String(err))
    );
    handleServerError(err instanceof Error ? err : new Error(String(err)));
  }
};

export default updateDocumentService;
