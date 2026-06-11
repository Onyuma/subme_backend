import { NextFunction, Request, Response } from "express";
import { ApiError, ZodError } from "../ApiError";
import * as z from "zod";
import { StatusCodes } from "http-status-codes";

export class ErrorHandler {
  static handleError = (
    err: ApiError | z.ZodError,
    req: Request,
    resp: Response,
    next: NextFunction
  ) => {
    if (err instanceof ApiError) {
      const statusCode = err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      resp.status(statusCode).json({
        success: false,
        message: message,
      });
    }
    if (err instanceof z.ZodError) {
      resp.status(500).json({
        success: false,
        message: "Validation error",
        reasons: err.issues,
      });
    }
  };
}
