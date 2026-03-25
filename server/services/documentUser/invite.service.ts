import { DocumentUserRole } from "@prisma/client";
import logger from "../../config/logger.config";
import { findDocumentById } from "../../repositories/document/document.repository";
import {
  createDocumentUser,
  findDocumentUser,
} from "../../repositories/document/documentUser.repository";
import { findUserByEmail } from "../../repositories/user/user.repository";
import { isValidDocumentUserRole, isValidEmail } from "../../utils/common.util";
import { ApiError, handleServerError } from "../../utils/error.utils";
import { sendInviteEmail } from "../../utils/mail/invite.util";
import { FRONTEND_URL } from "../../config/constants.config";

const inviteDocumentUserService = async (
  documentId: string,
  userId: string,
  email: string,
  role: DocumentUserRole
): Promise<void> => {
  try {
    if (!documentId.trim()) {
      throw new ApiError(400, "Document ID is required");
    }

    if (!isValidEmail(email)) {
      throw new ApiError(400, "Invalid email address");
    }

    if (!isValidDocumentUserRole(role)) {
      throw new ApiError(400, "Invalid user role");
    }

    const document = await findDocumentById(documentId);
    if (!document) {
      throw new ApiError(404, "Document not found");
    }

    if (document.ownerId !== userId) {
      throw new ApiError(403, "You are not the owner of this document");
    }

    const user = await findUserByEmail(email);
    if (!user) {
      throw new ApiError(404, "No account found with this email. Ask them to sign up first");
    }

    const existingDocumentUser = await findDocumentUser(documentId, user.id);
    if (existingDocumentUser) {
      throw new ApiError(400, "User is already a collaborator, cannot add them again");
    }

    const documentUser = await createDocumentUser({
      documentId,
      userId: user.id,
      role,
    });

    if (!documentUser) {
      throw new ApiError(500, "Error sending invite");
    }

    // fire and forget — don't await, don't block the response
    sendInviteEmail({
      to: email,
      inviteeName: user.name,
      documentTitle: document.title,
      role,
      documentUrl: `${FRONTEND_URL}/dashboard/document/${documentId}`,
    })
      .then(() => {
        logger.success(`Invite email sent successfully to ${email}`);
      })
      .catch((err) => {
        logger.error("Failed to send invite email: " + err.message);
      });

    logger.success(`DB updated for sending invite to ${user.name}`);
    return; // return so controller can respond
  } catch (err) {
    logger.error(
      "Error in inviteDocumentUserService: " + (err instanceof Error ? err.message : String(err))
    );
    handleServerError(err instanceof Error ? err : new Error(String(err)));
  }
};

export default inviteDocumentUserService;
