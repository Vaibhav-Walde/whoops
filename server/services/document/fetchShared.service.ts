import { handleServerError } from "../../utils/error.utils";
import logger from "../../config/logger.config";
import { fetchSharedDocuments } from "../../repositories/document/documentUser.repository";
import { Doc } from "../../utils/types/common.types";
import { DocumentUserRole } from "@prisma/client";

type SharedDocumentResult = Doc & {
  role: DocumentUserRole;
};

const fetchSharedDocumentsService = async (
  userId: string
): Promise<SharedDocumentResult[] | void> => {
  try {
    const documentUsers = await fetchSharedDocuments(userId);

    logger.success(`All documents shared with userId: ${userId} fetched successfully`);

    return documentUsers.map((du) => ({
      ...du.document,
      role: du.role,
    }));
  } catch (err) {
    logger.error(
      "Error in fetchSharedDocumentsService: " + (err instanceof Error ? err.message : String(err))
    );
    handleServerError(err instanceof Error ? err : new Error(String(err)));
  }
};

export default fetchSharedDocumentsService;
