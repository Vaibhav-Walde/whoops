import { Controller } from "../utils/types/express.types";

const reqBodyMiddleware: Controller = (req, res, next) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    res.status(400).json({
      success: false,
      message: "Request body is empty",
    });
    return;
  }
  next();
};

export default reqBodyMiddleware;
