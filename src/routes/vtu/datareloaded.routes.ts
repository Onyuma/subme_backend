import express, { NextFunction, Request, Response } from "express";
import { NotFoundError } from "../../utils/ApiError";
import { RouteParams } from "../../types";
import datareloadedController from "./datareloaded.controller";

const vtuRouter = express.Router();

const routes: RouteParams[] = [
  {
    method: "GET",
    route: "/fetch",
    handler: datareloadedController.getDataPlan,
  },
];

routes.forEach((route) => {
  switch (route.method) {
    case "GET":
      vtuRouter.get(route.route, route.handler);
      break;
    case "POST":
      vtuRouter.post(route.route, route.handler);
      break;
    case "PUT":
      vtuRouter.put(route.route, route.handler);
      break;
    case "DELETE":
      vtuRouter.delete(route.route, route.handler);
      break;
    case "PATCH":
      vtuRouter.patch(route.route, route.handler);
      break;
  }
});

vtuRouter.use((req: Request, res: Response, next: NextFunction) => {
  throw new NotFoundError(`VTU Route: Route ${req.path} not found`);
});

export default vtuRouter;
