import express, { Application, NextFunction, Request, Response } from "express";
import configs from "./utils/configs";
import { NotFoundError } from "./utils/ApiError";
import { ErrorHandler } from "./utils/Middlewares/ErrorHandler";
import dbrelations from "./utils/dbrelations";
import paymentRouter from "./routes/payment/payment.routes";
import connection from "./utils/database";
import vtuRouter from "./routes/vtu/datareloaded.routes";
import userRouter from "./routes/user/user.route";
import walletRouter from "./routes/wallet/wallet.route";

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/paystack", paymentRouter);
app.use("/vtu", vtuRouter);
app.use("/user", userRouter);
app.use("/wallet", walletRouter);

app.post("/home", (req: Request, resp: Response) => {
  resp.json({
    message: "success",
  });
});

app.use((req: Request) => {
  throw new NotFoundError(req.path);
});
app.use(ErrorHandler.handleError);

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
