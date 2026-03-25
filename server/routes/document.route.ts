import { Router } from "express";
import fetchAllDocumentController from "../controllers/document/fetchAll.controller";
import authMiddleware from "../middleware/auth.middleware";
import reqBodyMiddleware from "../middleware/reqBody.middleware";
import createDocumentController from "../controllers/document/create.controller";
import deleteDocumentController from "../controllers/document/delete.controller";
import fetchOneDocumentController from "../controllers/document/fetchOne.controller";
import saveDocumentController from "../controllers/document/save.controller";
import inviteDocumentUserController from "../controllers/documentUser/invite.controller";
import fetchAllDocumentUserController from "../controllers/documentUser/fetchAll.controller";
import updateDocumentUserRoleController from "../controllers/documentUser/updateRole.controller";
import removeDocumentUserController from "../controllers/documentUser/remove.controller";
import fetchSharedDocumentsController from "../controllers/document/fetchShared.controller";
import updateDocumentController from "../controllers/document/update.controller";

const router = Router();

router.use(authMiddleware);

// Document routes (core)
router.get("/", fetchAllDocumentController);
router.get("/shared", fetchSharedDocumentsController);
router.post("/", reqBodyMiddleware, createDocumentController);
router.delete("/:id", deleteDocumentController);
router.get("/:id", fetchOneDocumentController);
router.patch("/:id", reqBodyMiddleware, updateDocumentController);
router.patch("/:id/save", reqBodyMiddleware, saveDocumentController);

// Document user (collaborator) routes
router.post("/:id/invite", reqBodyMiddleware, inviteDocumentUserController);
router.get("/:id/collaborators", fetchAllDocumentUserController);
router.patch(
  "/:documentId/collaborators/:documentUserId",
  reqBodyMiddleware,
  updateDocumentUserRoleController
);
router.delete("/:documentId/collaborators/:documentUserId", removeDocumentUserController);

export default router;
