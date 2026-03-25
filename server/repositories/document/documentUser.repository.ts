import { DocumentUserRole } from "@prisma/client";
import prisma from "../../config/prisma.config";
import { CreateDocumentUserInput } from "../../utils/types/common.types";

const findDocumentUser = async (documentId: string, userId: string) => {
  try {
    const documentUser = await prisma.documentUser.findUnique({
      where: {
        userId_documentId: {
          userId,
          documentId,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            imageUrl: true,
          },
        },
      },
    });

    return documentUser;
  } catch (err) {
    throw err;
  }
};

const createDocumentUser = async (documentUser: CreateDocumentUserInput) => {
  try {
    const newUser = await prisma.documentUser.create({
      data: {
        userId: documentUser.userId,
        documentId: documentUser.documentId,
        ...(documentUser.role !== undefined && { role: documentUser.role }),
      },
    });

    return newUser;
  } catch (err) {
    throw err;
  }
};

const updateDocumentUserRole = async (
  documentId: string,
  userId: string,
  role: DocumentUserRole
) => {
  try {
    const updatedUser = await prisma.documentUser.update({
      where: {
        userId_documentId: {
          userId: userId,
          documentId: documentId,
        },
      },
      data: {
        role: role,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            imageUrl: true,
          },
        },
      },
    });

    return updatedUser;
  } catch (err) {
    throw err;
  }
};

const deleteDocumentUser = async (documentId: string, userId: string) => {
  try {
    const deletedUser = await prisma.documentUser.delete({
      where: {
        userId_documentId: {
          userId: userId,
          documentId: documentId,
        },
      },
    });

    return deletedUser;
  } catch (err) {
    throw err;
  }
};

const findDocumentUsersByDocument = async (documentId: string) => {
  try {
    const documentUsers = await prisma.documentUser.findMany({
      where: { documentId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            imageUrl: true,
          },
        },
      },
    });

    return documentUsers;
  } catch (err) {
    throw err;
  }
};

const fetchSharedDocuments = async (userId: string) => {
  try {
    const documentUsers = await prisma.documentUser.findMany({
      where: { userId },
      include: {
        document: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return documentUsers;
  } catch (err) {
    throw err;
  }
};

export {
  findDocumentUser,
  createDocumentUser,
  updateDocumentUserRole,
  deleteDocumentUser,
  findDocumentUsersByDocument,
  fetchSharedDocuments,
};
