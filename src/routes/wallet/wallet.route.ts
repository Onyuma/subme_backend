import express, { NextFunction, Request, Response } from "express";
import { NotFoundError } from "../../utils/ApiError";
import { RouteParams } from "../../types";
import walletController from "./wallet.controller";

const walletRouter = express.Router();

const routes: RouteParams[] = [
  {
    method: "POST",
    route: "/fund",
    handler: walletController.postFundWallet,
  },
  {
    method: "GET",
    route: "/balance",
    handler: walletController.getWalletBalance,
  },
];

routes.forEach((route) => {
  switch (route.method) {
    case "GET":
      walletRouter.get(route.route, route.handler);
      break;
    case "POST":
      walletRouter.post(route.route, route.handler);
      break;
    case "PUT":
      walletRouter.put(route.route, route.handler);
      break;
    case "DELETE":
      walletRouter.delete(route.route, route.handler);
      break;
    case "PATCH":
      walletRouter.patch(route.route, route.handler);
      break;
  }
});

walletRouter.use((req: Request, res: Response, next: NextFunction) => {
  throw new NotFoundError(`Wallet Route: Route ${req.path} not found`);
});

export default walletRouter;
