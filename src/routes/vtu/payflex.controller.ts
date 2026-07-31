import { Request, Response } from "express";
import asyncWrapper from "../../utils/asyncwrapper";
import { StatusCodes } from "http-status-codes";
import squadApi from "../../services/squad.api";
import payflexApi from "../../services/payflex.api";
import { BadRequestError, ZodError } from "../../utils/ApiError";
import zod from "zod";
import { Payflex } from "../../types";

const PayloadType = zod.object({
  phone: zod.string().trim().length(11),
  amount: zod.number().min(20),
  network: zod.enum(["mtn", "glo", "9mobile"]),
});

class PayflexController {
  postPurchaseAirtime = asyncWrapper(async (req: any, resp: Response) => {
    const { amount, network, phone } = req.body;
    const user = req.user;

    if (!amount || !phone || !network) {
      throw new BadRequestError("Amount, Network, and Phone is required");
    }

    const parsed = PayloadType.safeParse({
      amount: Number(amount),
      phone,
      network,
    });
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

    const payload: Payflex.BuyAirtimePayload = {
      amount: parsed.data.amount,
      mobile_number: parsed.data.phone,
      network: parsed.data.network,
    };
    const response = await payflexApi.buyAirtime(payload);
    await wallet.save();

    resp.status(StatusCodes.OK).json({
      success: true,
      message: "Airtime purchased successfully.",
      data: response,
    });
  });

  getCableProviders = asyncWrapper(async (req: Request, resp: Response) => {
    const response = await payflexApi.cableProviders();

    resp.status(StatusCodes.OK).json({
      success: true,
      message: "Cable Providers retrieved successfully.",
      data: response,
    });
  });
}

const payflexController = new PayflexController();
export default payflexController;
