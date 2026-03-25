import prisma from "../config/prisma.config";
import logger from "../config/logger.config";

const documentVersionCleanupWorker = async () => {
  try {
    const currentDate = new Date();
    logger.debug(`Document Version Cleanup Worker started at ${currentDate}`);

    // get all unique documentIds
    const documents = await prisma.documentVersion.groupBy({
      by: ["documentId"],
      having: {
        documentId: {
          _count: {
            gt: 20,
          },
        },
      },
    });

    let totalDeleted = 0;

    for (const { documentId } of documents) {
      // get the latest 20 version IDs for this document
      const latest20 = await prisma.documentVersion.findMany({
        where: { documentId },
        orderBy: { savedAt: "desc" },
        take: 20,
        select: { id: true },
      });

      const keepIds = latest20.map((v) => v.id);

      // delete everything else
      const { count } = await prisma.documentVersion.deleteMany({
        where: {
          documentId,
          id: { notIn: keepIds },
        },
      });

      if (count > 0) {
        logger.debug(`Deleted ${count} old versions for document ${documentId}`);
        totalDeleted += count;
      } else {
        logger.debug(`Count <= 0 no documents to be deleted for document: ${documentId}`);
      }
    }

    logger.debug(`Document Version Cleanup Worker finished — total deleted: ${totalDeleted}`);
  } catch (err) {
    logger.error(
      "Error in Document Version Cleanup Worker: " +
        (err instanceof Error ? err.message : String(err))
    );
  }
};

export default documentVersionCleanupWorker;
