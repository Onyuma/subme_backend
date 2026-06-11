import express, { NextFunction, Request, Response } from "express";
import { NotFoundError } from "../../utils/ApiError";
import { RouteParams } from "../../types";
import transactionController from "./transaction.controller";

const transactionRouter = express.Router();

const routes: RouteParams[] = [
  {
    method: "POST",
    route: "/create",
    handler: transactionController.postCreateTransaction,
  },
  {
    method: "GET",
    route: "/fetch",
    handler: transactionController.getTransactions,
  },
];

routes.forEach((route) => {
  switch (route.method) {
    case "GET":
      transactionRouter.get(route.route, route.handler);
      break;
    case "POST":
      transactionRouter.post(route.route, route.handler);
      break;
    case "PUT":
      transactionRouter.put(route.route, route.handler);
      break;
    case "DELETE":
      transactionRouter.delete(route.route, route.handler);
      break;
    case "PATCH":
      transactionRouter.patch(route.route, route.handler);
      break;
  }
});

transactionRouter.use((req: Request, res: Response, next: NextFunction) => {
  throw new NotFoundError(`Transaction Route: Route ${req.path} not found`);
});

export default transactionRouter;
