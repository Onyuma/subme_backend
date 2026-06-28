import { Request, Response } from "express";
import asyncWrapper from "../../utils/asyncwrapper";
import datareloadedApi from "../../services/datareloaded.api";
import { StatusCodes } from "http-status-codes";
import squadApi from "../../services/squad.api";
import zod from "zod";
import { BadRequestError, ZodError } from "../../utils/ApiError";
import { Squad } from "../../types";

const PayloadType = zod.object({
  phone: zod.string().trim().length(11),
  amount: zod.number().min(50),
});

class SquadController {
  postPurchaseAirtime = asyncWrapper(async (req: any, resp: Response) => {
    const { amount, phone } = req.body;
    const user = req.user;

    if (!amount || !phone) {
      throw new BadRequestError("Amount and Phone is required");
    }

    const parsed = PayloadType.safeParse({ amount: Number(amount), phone });
    if (parsed.error) {
      throw new ZodError(parsed.error.issues);
    }
    const wallet = await user.getWallet();
    if (!wallet) {
      throw new BadRequestError("User wallet not found");
    }

    if (wallet.balance - Number(parsed.data.amount) < 0) {
      throw new BadRequestError("Insufficient wallet balance");
    }

    wallet.balance -= Number(parsed.data.amount);

    const payload: Squad.BuyAirtimePayload = {
      amount: parsed.data.amount,
      phone_number: parsed.data.phone,
    };
    const response = await squadApi.buyAirtime(payload);
    await wallet.save();

    resp.status(StatusCodes.OK).json({
      success: true,
      message: "Airtime purchased successfully.",
      data: response,
    });
  });

  getRetrieveDataplan = asyncWrapper(async (req: Request, resp: Response) => {
    const network = req.query.network;

    const response = await squadApi.retrieveDataPlan(network as string);
    resp.status(StatusCodes.OK).json({
      success: true,
      message: "Data plan retrieved successfully.",
      data: response,
    });
  });
}

const squadController = new SquadController();
export default squadController;
