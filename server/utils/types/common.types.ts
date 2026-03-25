import { Document, DocumentUserRole, DocumentVersion, Prisma, User } from "@prisma/client";

type CreateUserInput = Prisma.UserCreateInput;
type CreateDocumentInput = Prisma.DocumentUncheckedCreateInput;
type CreateDocumentUserInput = Prisma.DocumentUserUncheckedCreateInput;
type UserUpdateInput = Prisma.UserUpdateInput;
type DocumentUpdateInput = Prisma.DocumentUpdateInput;
type Doc = Document;
type UserType = User;
type DocVersion = DocumentVersion;

type DocumentMember = {
  id: string;
  role: DocumentUserRole | "OWNER";
  user: {
    id: string;
    email: string;
    name: string;
    imageUrl: string | null;
  };
};

type AuthTokenPayload = {
  id: string;
  role: string;
};

type DecodeResult = { success: true; token: AuthTokenPayload } | { success: false; token: null };

export type {
  CreateUserInput,
  CreateDocumentInput,
  DecodeResult,
  AuthTokenPayload,
  CreateDocumentUserInput,
  DocumentMember,
  UserUpdateInput,
  DocumentUpdateInput,
  Doc,
  UserType,
  DocVersion,
};
