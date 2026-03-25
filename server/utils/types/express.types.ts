import { Request, Response, NextFunction } from "express";
import { User } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

// Basic controller type
export type Controller = (req: Request, res: Response, next: NextFunction) => Promise<void> | void;

// Controller with typed body
export type BodyController<T> = (
  req: Request<{}, {}, T>,
  res: Response,
  next: NextFunction
) => Promise<void> | void;

// Controller with typed params
export type ParamsController<T extends Record<string, string>> = (
  req: Request<T>,
  res: Response,
  next: NextFunction
) => Promise<void> | void;

// Controller with typed body + params
export type BodyParamsController<TBody, TParams extends Record<string, string> = {}> = (
  req: Request<TParams, {}, TBody>,
  res: Response,
  next: NextFunction
) => Promise<void> | void;

// Controller with typed query
export type QueryController<T> = (
  req: Request<{}, {}, {}, T>,
  res: Response,
  next: NextFunction
) => Promise<void> | void;
