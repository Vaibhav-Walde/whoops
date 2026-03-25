// src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";
import { NODE_ENV } from "./constants.config";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
