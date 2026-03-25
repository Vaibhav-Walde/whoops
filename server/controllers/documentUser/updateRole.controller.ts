import { DocumentUserRole } from "@prisma/client";
import updateDocumentUserRoleService from "../../services/documentUser/updateRole.service";
import { BodyParamsController } from "../../utils/types/express.types";

type UpdateDocumentUserRoleBody = {
  role: DocumentUserRole;
};

type UpdateDocumentUserRoleParams = {
  documentId: string;
  documentUserId: string;
};

const updateDocumentUserRoleController: BodyParamsController<
  UpdateDocumentUserRoleBody,
  UpdateDocumentUserRoleParams
> = async (req, res, next) => {
  try {
    const { documentId, documentUserId } = req.params;
    const { role } = req.body;

    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }
    if (!role) {
      res.status(400).json({ success: false, message: "Email and role are required" });
      return;
    }
    const collaborator = await updateDocumentUserRoleService(
      documentId,
      userId,
      documentUserId,
      role
    );

    res.status(200).json({
      success: true,
      message: `Access updated successfully`,
      collaborator,
    });
  } catch (err) {
    next(err);
  }
};

export default updateDocumentUserRoleController;
