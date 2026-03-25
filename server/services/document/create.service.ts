import logger from "../../config/logger.config";
import { insertDocument } from "../../repositories/document/document.repository";
import { ApiError, handleServerError } from "../../utils/error.utils";
import { CreateDocumentInput, Doc } from "../../utils/types/common.types";

const validateUserInput = (input: CreateDocumentInput): void => {
  if (!input.title?.trim()) {
    throw new ApiError(400, "Title is required.");
  }
  if (input.description && !input.description.trim()) {
    throw new ApiError(400, "Description cannot be empty.");
  }
};

const createDocumentService = async (input: CreateDocumentInput): Promise<Doc | void> => {
  try {
    validateUserInput(input);
    const newDocument = await insertDocument(input);
    logger.success(`Document title: ${input.title} created successfully`);
    return newDocument;
  } catch (err) {
    logger.error(
      "Error in createDocumentService: " + (err instanceof Error ? err.message : String(err))
    );
    handleServerError(err instanceof Error ? err : new Error(String(err)));
  }
};

export default createDocumentService;
