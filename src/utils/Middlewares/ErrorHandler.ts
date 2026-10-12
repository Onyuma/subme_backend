import { NextFunction, Request, Response } from "express";
import { ApiError, ForeignKeyError, ZodError } from "../ApiError";
import * as z from "zod";
import { StatusCodes } from "http-status-codes";

export class ErrorHandler {
  static sendDev = (resp: Response, err: any) => {
    const statusCode = err.statusCode || 500;
    resp.status(statusCode).json({
      success: false,
      message: err.message,
      error: err,
      stack: err.stack,
    });
  };

  static sendProd = (resp: Response, err: any) => {
    if (err.isOperational) {
      resp.status(err.statusCode).json({
        success: false,
        message: err.message,
      });
    } else {
      resp.status(500).json({
        success: false,
        message: "Something went wrong",
        error: err,
      });
    }
  };

  static foreignKeyErrorDB = (error: any) => {
    return new ForeignKeyError("Foreign Key Error");
  };
  static webTokenExpiredError = (error: any) => {
    return new ApiError(
      StatusCodes.UNAUTHORIZED,
      "Token expired, please login again"
    );
  };

  static invalidTokenError = (error: any) => {
    return new ApiError(
      StatusCodes.UNAUTHORIZED,
      "Invalid token, please login again"
    );
  };
  static handleError = (
    err: any,
    req: Request,
    resp: Response,
    next: NextFunction
  ) => {
    if (process.env.NODE_ENV === "production") {
      let error = { ...err };

      switch (err.name) {
        case "MongoError":
          error.statusCode = 404;
          error.message = "Duplicate value";
          break;
        case "ZodError":
          error.statusCode = 404;
          error.message = "Network must be either: mtn, glo, or 9mobile";
          break;
        case "SequelizeForeignKeyConstraintErrorr":
          error = this.foreignKeyErrorDB(err);
          break;
        case "TokenExpiredError":
          error = this.webTokenExpiredError(err);
          break;
        // case "JsonWebTokenError":
        //   error = this.invalidTokenError(err);
        //   break;
        default:
          error.statusCode = err.statusCode;
          error.message = err.message;
      }
      this.sendProd(resp, error);
    } else if (process.env.NODE_ENV === "development") {
      this.sendDev(resp, err);
    }
  };
}
