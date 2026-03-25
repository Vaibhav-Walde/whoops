import { DocumentUserRole } from "@prisma/client";
import { ApiError, handleServerError } from "../../utils/error.utils";
import { findDocumentById } from "../../repositories/document/document.repository";
import logger from "../../config/logger.config";
import {
  findDocumentUser,
  updateDocumentUserRole as updateDocumentUserRoleRepo,
} from "../../repositories/document/documentUser.repository";
import { isValidDocumentUserRole } from "../../utils/common.util";
import { DocumentMember } from "../../utils/types/common.types";

const updateDocumentUserRoleService = async (
  documentId: string,
  userId: string,
  documentUserId: string,
  role: DocumentUserRole
): Promise<DocumentMember | void> => {
  try {
    if (!documentId.trim()) {
      throw new ApiError(400, "Document ID is required");
    }

    if (!isValidDocumentUserRole(role)) {
      logger.error(`Invalid user role: ${role}`);
      throw new ApiError(400, `Invalid user role`);
    }

    const document = await findDocumentById(documentId);
    if (!document) {
      throw new ApiError(404, "Document not found");
    }

    if (document.ownerId !== userId) {
      throw new ApiError(403, "You don't have the permission");
    }

    if (documentUserId === document.ownerId) {
      throw new ApiError(400, "Cannot change the owner's role");
    }

    const documentUser = await findDocumentUser(documentId, documentUserId);
    if (!documentUser) {
      throw new ApiError(404, "User not found");
    }

    if (documentUser.role === role) {
      throw new ApiError(400, "User already has this role");
    }

    const updated = await updateDocumentUserRoleRepo(documentId, documentUserId, role);
    logger.success(`Document user: ${updated.user.name} updated role: ${updated.role}`);
    return updated;
  } catch (err) {
    logger.error(
      "Error in updateDocumentUserRoleService: " +
        (err instanceof Error ? err.message : String(err))
    );
    handleServerError(err instanceof Error ? err : new Error(String(err)));
  }
};

export default updateDocumentUserRoleService;
