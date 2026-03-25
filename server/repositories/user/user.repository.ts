import { User } from "@prisma/client";
import prisma from "../../config/prisma.config";
import { CreateUserInput, UserUpdateInput } from "../../utils/types/common.types";

const findUserByEmail = async (email: string): Promise<User | null> => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    return user;
  } catch (err) {
    throw err;
  }
};

const insertUser = async (user: CreateUserInput): Promise<User | null> => {
  try {
    const newUser = await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        provider: user.provider,
        ...(user.imageUrl !== undefined && { imageUrl: user.imageUrl }),
        ...(user.role !== undefined && { role: user.role }),
        ...(user.createdAt !== undefined && { createdAt: user.createdAt }),
        ...(user.updatedAt !== undefined && { updatedAt: user.updatedAt }),
      },
    });

    return newUser;
  } catch (err) {
    throw err;
  }
};

const findUserById = async (userId: string): Promise<User | null> => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    return user;
  } catch (err) {
    throw err;
  }
};

const updateUser = async (id: string, data: UserUpdateInput) => {
  try {
    const updatedUser = await prisma.user.update({
      where: {
        id,
      },
      data,
    });

    return updatedUser;
  } catch (err) {
    throw err;
  }
};

const deleteUser = async (id: string) => {
  try {
    await prisma.user.delete({
      where: {
        id,
      },
    });
    return true;
  } catch (err) {
    throw err;
  }
};

export { findUserByEmail, insertUser, findUserById, updateUser, deleteUser };
