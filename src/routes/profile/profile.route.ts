import express, { NextFunction, Request, Response } from "express";
import { NotFoundError } from "../../utils/ApiError";
import { RouteParams } from "../../types";
import profileController from "./profile.controller";

const profileRouter = express.Router();

const routes: RouteParams[] = [
  {
    method: "GET",
    route: "/details",
    handler: profileController.getUserProfile,
  },
];

routes.forEach((route) => {
  switch (route.method) {
    case "GET":
      profileRouter.get(route.route, route.handler);
      break;
    case "POST":
      profileRouter.post(route.route, route.handler);
      break;
    case "PUT":
      profileRouter.put(route.route, route.handler);
      break;
    case "DELETE":
      profileRouter.delete(route.route, route.handler);
      break;
    case "PATCH":
      profileRouter.patch(route.route, route.handler);
      break;
  }
});

profileRouter.use((req: Request, res: Response, next: NextFunction) => {
  throw new NotFoundError(`Profile Route: Route ${req.path} not found`);
});

export default profileRouter;
