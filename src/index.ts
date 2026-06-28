import express, { Application, NextFunction, Request, Response } from "express";
import configs from "./utils/configs";
import { NotFoundError, ZodError } from "./utils/ApiError";
import { ErrorHandler } from "./utils/Middlewares/ErrorHandler";
import dbrelations from "./utils/dbrelations";
import paymentRouter from "./routes/payment/payment.routes";
import connection from "./utils/database";
import vtuRouter from "./routes/vtu/datareloaded.routes";
import userRouter from "./routes/user/user.route";
import walletRouter from "./routes/wallet/wallet.route";
import helmet from "helmet";
import * as z from "zod";
import profileRouter from "./routes/profile/profile.route";
import transactionRouter from "./routes/transaction/transaction.route";
import userMiddleWare from "./utils/Middlewares/user.middleware";

const app: Application = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const ReqType = z.object({
  email: z.email(),
  password: z.string().max(5),
  confirm_password: z.string().max(5),
  number: z.number(),
});

const base = ReqType.refine((data) => data.password === data.confirm_password, {
  error: "Password must match",
  when: (payload) => {
    return ReqType.pick({ password: true, confirm_password: true }).safeParse(
      payload.value
    ).success;
  },
});

app.route("/test").post((req: Request, resp: Response, next: NextFunction) => {
  const body = req.body;
  const parsed = ReqType.safeParse(body);
  if (parsed.error) {
    throw new ZodError(parsed.error.issues);
  }
  resp.status(200).json({
    success: true,
    message: "Received",
    data: parsed.data,
  });
});

app.use("/paystack", paymentRouter);
app.use("/vtu", userMiddleWare, vtuRouter);
app.use("/user", userRouter);
app.use("/wallet", userMiddleWare, walletRouter);
app.use("/profile", profileRouter);
app.use("/transaction", userMiddleWare, transactionRouter);

app.post("/home", (req: Request, resp: Response) => {
  resp.json({
    message: "success",
  });
});

app.use((req: Request) => {
  throw new NotFoundError(req.path);
});
app.use(ErrorHandler.handleError);

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise);
  console.error("Reason:", reason);
});

dbrelations();
const startServer = async () => {
  const PORT = configs.PORT;
  connection
    .authenticate()
    .then(async () => {
      await connection.sync();
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    })
    .catch((err) => {
      console.error("Unable to connect to the database:", err);
    });
};

startServer();
