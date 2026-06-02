import express, { NextFunction, Request, Response } from "express";
import PaystackController from "./paystack.controller";
import { NotFoundError } from "../../utils/ApiError";
import { RouteParams } from "../../types";

const paymentRouter = express.Router();

const routes: RouteParams[] = [
  {
    method: "POST",
    route: "/initiate",
    handler: PaystackController.initiatePayment,
  },
  {
    method: "GET",
    route: "/verify",
    handler: PaystackController.verifyPayment,
  },
];

routes.forEach((route) => {
  switch (route.method) {
    case "GET":
      paymentRouter.get(route.route, route.handler);
      break;
    case "POST":
      paymentRouter.post(route.route, route.handler);
      break;
    case "PUT":
      paymentRouter.put(route.route, route.handler);
      break;
    case "DELETE":
      paymentRouter.delete(route.route, route.handler);
      break;
    case "PATCH":
      paymentRouter.patch(route.route, route.handler);
      break;
  }
});

paymentRouter.use((req: Request, res: Response, next: NextFunction) => {
  throw new NotFoundError(`Payment Route: Route ${req.path} not found`);
});

export default paymentRouter;
