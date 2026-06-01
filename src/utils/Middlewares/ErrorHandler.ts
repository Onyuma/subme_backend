import { NextFunction, Request, Response } from "express";
import configs from "../configs";
import { ApiError } from "../ApiError";

export class ErrorHandler {
  static handleError = (
    err: ApiError,
    req: Request,
    resp: Response,
    next: NextFunction
  ) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    resp.status(statusCode).json({
      success: false,
      message: message,
    });
  };
}
