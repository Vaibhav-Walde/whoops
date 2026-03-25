import { UserRole, AuthProvider, DocumentUserRole } from "@prisma/client";

const isValidUserRole = (role: string): boolean => {
  return Object.values(UserRole).includes(role as UserRole);
};

const isValidAuthProvider = (authProvider: string): boolean => {
  return Object.values(AuthProvider).includes(authProvider as AuthProvider);
};

const isValidDocumentUserRole = (role: string): boolean => {
  return Object.values(DocumentUserRole).includes(role as DocumentUserRole);
};

const canEditDocument = (role: string): boolean => {
  return role === DocumentUserRole.EDITOR;
};

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  return emailRegex.test(email);
};

const moreRecent = (a: Date | string, b: Date | string): Date => {
  return new Date(Math.max(new Date(a).getTime(), new Date(b).getTime()));
};

export {
  isValidUserRole,
  isValidAuthProvider,
  canEditDocument,
  isValidEmail,
  isValidDocumentUserRole,
  moreRecent,
};
