import express, { Application, NextFunction, Request, Response } from "express";
import configs from "./utils/configs";
import { NotFoundError } from "./utils/ApiError";
import { ErrorHandler } from "./utils/Middlewares/ErrorHandler";
import dbrelations from "./utils/dbrelations";

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req: Request, resp: Response, next: NextFunction) => {
  throw new NotFoundError(req.path);
});
app.use(ErrorHandler.handleError);

dbrelations();
const PORT = configs.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
