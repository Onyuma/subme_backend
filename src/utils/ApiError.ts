import { StatusCodes } from "http-status-codes";
import * as z from "zod";

export class ApiError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends ApiError {
  constructor(path: string) {
    super(StatusCodes.NOT_FOUND, `The requested path ${path} was not found.`);
  }
}

export class BadRequestError extends ApiError {
  constructor(message: string) {
    super(StatusCodes.BAD_REQUEST, message);
  }
}
export class ForeignKeyError extends ApiError {
  constructor(message: string) {
    super(StatusCodes.BAD_REQUEST, message);
  }
}

export class ZodError extends z.ZodError {
  isOperational: boolean;

  constructor(zodIssue: z.core.$ZodIssue[]) {
    super(zodIssue);
    this.isOperational = true;
  }
}
