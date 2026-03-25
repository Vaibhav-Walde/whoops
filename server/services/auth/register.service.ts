import logger from "../../config/logger.config";
import { findUserByEmail, insertUser } from "../../repositories/user/user.repository";
import { isValidAuthProvider, isValidUserRole } from "../../utils/common.util";
import { ApiError, handleServerError } from "../../utils/error.utils";
import { generateAuthToken } from "../../utils/jwt.util";
import { CreateUserInput } from "../../utils/types/common.types";

const validateUserInput = (user: CreateUserInput): void => {
  if (!user.name?.trim()) {
    throw new ApiError(400, "Name is required");
  }
  if (!user.email?.trim()) {
    throw new ApiError(400, "Email is required");
  }
  if (!user.provider || !isValidAuthProvider(user.provider)) {
    throw new ApiError(400, "Invalid auth provider");
  }
  if (user.role && !isValidUserRole(user.role)) {
    throw new ApiError(400, "Invalid role");
  }
};

const registerUserService = async (user: CreateUserInput): Promise<string | void> => {
  try {
    validateUserInput(user);

    let currentUser = await findUserByEmail(user.email);

    if (!currentUser) {
      logger.debug("Creating new user");
      currentUser = await insertUser(user);
      if (!currentUser) {
        throw new ApiError(500, "Failed to create user");
      }
    } else {
      logger.debug(`User already exists, logging in: ${user.email}`);
    }

    const token = generateAuthToken({
      id: currentUser.id,
      role: currentUser.role,
    });

    logger.success(`${user.name} registered via oauth successfully`);

    return token;
  } catch (err) {
    logger.error(
      "Error in registerUserService " + (err instanceof Error ? err.message : String(err))
    );
    handleServerError(err instanceof Error ? err : new Error(String(err)));
  }
};

export default registerUserService;
