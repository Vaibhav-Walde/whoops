import prisma from "../../config/prisma.config";

const saveDocumentContent = async (
  documentId: string,
  userId: string,
  content: string // base64 from frontend
) => {
  try {
    const version = await prisma.documentVersion.create({
      data: {
        documentId,
        savedById: userId,
        content: Buffer.from(content, "base64"), // base64 → bytes
      },
    });
    return version;
  } catch (err) {
    throw err;
  }
};

const getLatestDocumentVersion = async (documentId: string) => {
  try {
    const version = await prisma.documentVersion.findFirst({
      where: { documentId },
      orderBy: { savedAt: "desc" },
    });

    if (!version) return null;

    return {
      ...version,
      content: Buffer.from(version.content).toString("base64"), // bytes → base64 for frontend
    };
  } catch (err) {
    throw err;
  }
};

export { saveDocumentContent, getLatestDocumentVersion };
