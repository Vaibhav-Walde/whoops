import logger from "../../config/logger.config";
import { findAllDocumentsByUser } from "../../repositories/document/document.repository";
import { handleServerError } from "../../utils/error.utils";
import { Doc } from "../../utils/types/common.types";

const fetchAllDocumentService = async (userId: string): Promise<Doc[] | void> => {
  try {
    const documents = await findAllDocumentsByUser(userId);
    logger.success(`Fetched all documents successfully`);
    return documents;
  } catch (err) {
    logger.error(
      "Error in fetchAllDocumentService: " + (err instanceof Error ? err.message : String(err))
    );
    handleServerError(err instanceof Error ? err : new Error(String(err)));
  }
};

export default fetchAllDocumentService;
