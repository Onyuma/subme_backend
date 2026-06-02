import express, { NextFunction, Request, Response } from "express";
import { NotFoundError } from "../../utils/ApiError";
import { RouteParams } from "../../types";
import userController from "./user.controller";

const userRouter = express.Router();

const routes: RouteParams[] = [
  {
    method: "POST",
    route: "/register",
    handler: userController.postRegisterUser,
  },
  {
    method: "GET",
    route: "/deactivate",
    handler: userController.getDeactivateUser,
  },
];

routes.forEach((route) => {
  switch (route.method) {
    case "GET":
      userRouter.get(route.route, route.handler);
      break;
    case "POST":
      userRouter.post(route.route, route.handler);
      break;
    case "PUT":
      userRouter.put(route.route, route.handler);
      break;
    case "DELETE":
      userRouter.delete(route.route, route.handler);
      break;
    case "PATCH":
      userRouter.patch(route.route, route.handler);
      break;
  }
});

userRouter.use((req: Request, res: Response, next: NextFunction) => {
  throw new NotFoundError(`User Route: Route ${req.path} not found`);
});

export default userRouter;
