import logger from "../../config/logger.config";
import { findDocumentById } from "../../repositories/document/document.repository";
import {
  findDocumentUser,
  findDocumentUsersByDocument,
} from "../../repositories/document/documentUser.repository";
import { ApiError, handleServerError } from "../../utils/error.utils";
import { DocumentMember } from "../../utils/types/common.types";

const fetchAllDocumentUsersService = async (
  documentId: string,
  userId: string
): Promise<DocumentMember[] | void> => {
  try {
    if (!documentId?.trim()) {
      throw new ApiError(400, "Document ID is required");
    }

    const document = await findDocumentById(documentId);
    if (!document) {
      throw new ApiError(404, "Document not found.");
    }

    if (document.ownerId !== userId) {
      const documentUser = await findDocumentUser(documentId, userId);
      if (!documentUser) {
        throw new ApiError(403, "You cannot access this information.");
      }
    }

    const documentUsers = await findDocumentUsersByDocument(documentId);

    // owner entry from the populated relation
    const ownerEntry: DocumentMember = {
      id: document.ownerId,
      role: "OWNER",
      user: {
        id: document.owner.id,
        name: document.owner.name,
        email: document.owner.email,
        imageUrl: document.owner.imageUrl,
      },
    };

    const collaborators: DocumentMember[] = documentUsers.map((documentUser) => ({
      id: documentUser.id,
      role: documentUser.role,
      user: {
        id: documentUser.user.id,
        name: documentUser.user.name,
        email: documentUser.user.email,
        imageUrl: documentUser.user.imageUrl,
      },
    }));

    logger.success(`All collaborators fetched for document: ${document.title}`);
    // owner always first
    return [ownerEntry, ...collaborators];
  } catch (err) {
    logger.error(
      "Error in fetchAllDocumentUsersService: " + (err instanceof Error ? err.message : String(err))
    );
    handleServerError(err instanceof Error ? err : new Error(String(err)));
  }
};

export default fetchAllDocumentUsersService;
