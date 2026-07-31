import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import asyncWrapper from "../../utils/asyncwrapper";
import User from "../../models/user.model";
import Transaction from "../../models/transaction.model";
import { BadRequestError, ZodError } from "../../utils/ApiError";
import { TransactionSchema } from "../../types";
import { Op, or, Sequelize } from "sequelize";

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
          [Op.or]: [{ senderId: user.uid }, { recipientId: user.uid }],
        },
        attributes: [
          "uid",
          "transaction_id",
          "network",
          "price",
          "category",
          "validity",
          "phone_number",
          [
            Sequelize.literal(
              `CASE WHEN "senderId" = ${user.uid} THEN 'sender' ELSE 'receiver' END`
            ),
            "role",
          ],
        ],
        include: [
          { model: User, as: "Sender", attributes: ["email"] },
          { model: User, as: "Recipient", attributes: ["email"] },
        ],
        order: [["createdAt", "DESC"]],
      });

    if (!transactions) {
      throw new BadRequestError("No transaction found");
    }

    const formattedTransactions = transactions.map((trx) => {
      const data = trx.toJSON();
      data.counterParty = data.role === "sender" ? data.Recipient : data.Sender;

      delete data.Sender;
      delete data.Recipient;

      return data;
    });
    resp.status(200).json({
      success: true,
      data: {
        formattedTransactions,
        total,
      },
    });
  });
}

const transactionController = new TransactionController();
export default transactionController;
