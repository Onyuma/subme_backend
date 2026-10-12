import express, { NextFunction, Request, Response } from "express";
import { NotFoundError } from "../../utils/ApiError";
import { RouteParams } from "../../types";
import authController from "./auth.controller";

const authRouter = express.Router();

const routes: RouteParams[] = [
  {
    method: "POST",
    route: "/register",
    handler: authController.postSignup,
  },
  {
    method: "POST",
    route: "/login",
    handler: authController.postLogin,
  },
  {
    method: "POST",
    route: "/forgot",
    handler: authController.postForgotPassword,
  },
  {
    method: "PATCH",
    route: "/reset",
    handler: authController.patchResetPassword,
  },
];

routes.forEach((route) => {
  switch (route.method) {
    case "GET":
      authRouter.get(route.route, route.handler);
      break;
    case "POST":
      authRouter.post(route.route, route.handler);
      break;
    case "PUT":
      authRouter.put(route.route, route.handler);
      break;
    case "DELETE":
      authRouter.delete(route.route, route.handler);
      break;
    case "PATCH":
      authRouter.patch(route.route, route.handler);
      break;
  }
});

authRouter.use((req: Request, res: Response, next: NextFunction) => {
  throw new NotFoundError(`Auth Route: Route ${req.path} not found`);
});

export default authRouter;
