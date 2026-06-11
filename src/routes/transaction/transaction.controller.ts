import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import asyncWrapper from "../../utils/asyncwrapper";
import User from "../../models/user.model";
import Transaction from "../../models/transaction.model";
import { BadRequestError, ZodError } from "../../utils/ApiError";
import { TransactionSchema } from "../../types";

class TransactionController {
  postCreateTransaction = asyncWrapper(async (req: any, resp: Response) => {
    const user: User = req.user;
    const parsed = TransactionSchema.safeParse(req.body);

    if (parsed.error) {
      throw new ZodError(parsed.error.issues);
    }

    const { category, network, phone_number, price, transaction_id, validity } =
      parsed.data;

    const transaction = await user.createTransaction({
      category,
      network,
      phone_number,
      price,
      transaction_id,
      validity,
    });

    if (!transaction) {
      throw new BadRequestError("Unable to create transaction");
    }

    resp.status(StatusCodes.CREATED).json({
      success: true,
      message: "Transaction created successsfully",
      data: {
        transaction,
      },
    });
  });
  getTransactions = asyncWrapper(async (req: any, resp: Response) => {
    const user: User = req.user;
    const { page, size } = req.query;

    const current = parseInt(page as string, 10) || 1;
    const limit = parseInt(size as string, 10) || 10;

    const offset = (current - 1) * limit;

    const { count: total, rows: transactions } =
      await Transaction.findAndCountAll({
        limit,
        offset,
        where: {
          userUid: user.uid,
        },
        order: [["createdAt", "DESC"]],
      });

    if (!transactions) {
      throw new BadRequestError("No transaction found");
    }
    resp.status(200).json({
      success: true,
      data: {
        transactions,
        total,
      },
    });
  });
}

const transactionController = new TransactionController();
export default transactionController;
