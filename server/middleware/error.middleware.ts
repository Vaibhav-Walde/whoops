import { ErrorRequestHandler } from "express";
import logger from "../config/logger.config";

const errorHandlerMiddleware: ErrorRequestHandler = (err, _req, res, _next) => {
  logger.error(`${err.name}: ${err.message}`);
  console.log(err);
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};

export default errorHandlerMiddleware;
