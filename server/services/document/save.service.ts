import logger from "../../config/logger.config";
import { findDocumentById } from "../../repositories/document/document.repository";
import { saveDocumentContent } from "../../repositories/document/documentVersion.repository";
import { findDocumentUser } from "../../repositories/document/documentUser.repository";
import { canEditDocument } from "../../utils/common.util";
import { ApiError, handleServerError } from "../../utils/error.utils";
import { DocVersion } from "../../utils/types/common.types";

const saveDocumentService = async (
  documentId: string,
  userId: string,
  content: string
): Promise<DocVersion | void> => {
  try {
    if (!documentId.trim()) {
      throw new ApiError(400, "Document ID is required");
    }

    const document = await findDocumentById(documentId);
    if (!document) {
      throw new ApiError(404, "Document not found.");
    }

    if (document.ownerId !== userId) {
      const documentUser = await findDocumentUser(documentId, userId);
      if (!documentUser || !canEditDocument(documentUser.role)) {
        throw new ApiError(403, "You do not have access to edit this document.");
      }
    }

    const version = await saveDocumentContent(documentId, userId, content);
    if (!version) {
      throw new ApiError(500, "Error saving document version.");
    }
    logger.success(`Document title: ${document.title} saved successfully`);
    return version;
  } catch (err) {
    logger.error(
      "Error in saveDocumentService: " + (err instanceof Error ? err.message : String(err))
    );
    handleServerError(err instanceof Error ? err : new Error(String(err)));
  }
};

export default saveDocumentService;
