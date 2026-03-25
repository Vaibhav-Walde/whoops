import { BodyParamsController } from "../../utils/types/express.types";
import { DocumentUserRole } from "@prisma/client";
import inviteDocumentUserService from "../../services/documentUser/invite.service";

type InviteBody = {
  email: string;
  role: DocumentUserRole;
};

type InviteParams = {
  id: string;
};

const inviteDocumentUserController: BodyParamsController<InviteBody, InviteParams> = async (
  req,
  res,
  next
) => {
  try {
    const { id: documentId } = req.params;
    const { email, role } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    if (!email || !role) {
      res.status(400).json({ success: false, message: "Email and role are required" });
      return;
    }

    await inviteDocumentUserService(documentId, userId, email, role);

    res.status(201).json({
      success: true,
      message: `Invite sent to ${email}`,
    });
  } catch (err) {
    next(err);
  }
};

export default inviteDocumentUserController;
