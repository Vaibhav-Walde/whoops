import { findUserById, deleteUser } from "../../repositories/user/user.repository";
import { ApiError, handleServerError } from "../../utils/error.utils";
import logger from "../../config/logger.config";

const deleteProfileService = async (userId: string): Promise<boolean | void> => {
  try {
    const user = await findUserById(userId);
    if (!user) throw new ApiError(404, "User not found");

    await deleteUser(userId);
    logger.success(`User: ${user.name} deleted successfully`);
    return true;
  } catch (err) {
    logger.error(
      "Error in deleteProfileService: " + (err instanceof Error ? err.message : String(err))
    );
    handleServerError(err instanceof Error ? err : new Error(String(err)));
  }
};

export default deleteProfileService;
