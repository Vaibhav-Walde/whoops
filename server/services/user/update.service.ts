import { findUserById, updateUser } from "../../repositories/user/user.repository";
import { ApiError, handleServerError } from "../../utils/error.utils";
import logger from "../../config/logger.config";
import { UserType } from "../../utils/types/common.types";

const updateProfileService = async (userId: string, name: string): Promise<UserType | void> => {
  try {
    const user = await findUserById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (!name || !name.trim()) {
      throw new ApiError(400, "Invalid value");
    }

    const updated = await updateUser(userId, { name });
    logger.success(`User: ${user.name} update successfully`);
    return updated;
  } catch (err) {
    logger.error(
      "Error in updateProfileService: " + (err instanceof Error ? err.message : String(err))
    );
    handleServerError(err instanceof Error ? err : new Error(String(err)));
  }
};

export default updateProfileService;
