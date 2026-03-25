import logger from "../../config/logger.config";
import { deleteDocument, findDocumentById } from "../../repositories/document/document.repository";
import { ApiError, handleServerError } from "../../utils/error.utils";

const deleteDocumentService = async (
  documentId: string,
  userId: string
): Promise<boolean | void> => {
  try {
    if (!documentId.trim()) {
      throw new ApiError(400, "Document ID is required");
    }

    const document = await findDocumentById(documentId);
    if (!document) {
      throw new ApiError(404, "Document not found.");
    }

    if (document.ownerId !== userId) {
      throw new ApiError(403, "You cannot delete this document.");
    }

    await deleteDocument(documentId);
    logger.success(`Document title: ${document.title} deleted successfully`);
    return true;
  } catch (err) {
    logger.error(
      "Error in deleteDocumentService: " + (err instanceof Error ? err.message : String(err))
    );
    handleServerError(err instanceof Error ? err : new Error(String(err)));
  }
};

export default deleteDocumentService;
