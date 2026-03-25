import { Controller } from "../utils/types/express.types";
import logger from "../config/logger.config";

const loggerMiddleware: Controller = (req, _res, next) => {
  const path = req.path || req.url;
  logger.debug(`[${req.method}] ${path}`);
  next();
};

export default loggerMiddleware;
