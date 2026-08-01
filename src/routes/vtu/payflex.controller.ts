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

const DataPayloadType = zod.object({
  phone: zod.string().trim().length(11),
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

  postPurchaseData = asyncWrapper(async (req: any, resp: Response) => {
    const { planCode, networkCode, phone } = req.body;
    const user = req.user;

    if (!planCode || !networkCode || !phone) {
      throw new BadRequestError(
        "Plan Code, Network Code, and Phone is required"
      );
    }

    const parsed = DataPayloadType.safeParse({
      phone,
    });
    if (parsed.error) {
      throw new ZodError(parsed.error.issues);
    }
    const wallet = await user.getWallet();
    if (!wallet) {
      throw new BadRequestError("User wallet not found");
    }

    const selectedPlan = await payflexApi.retrieveDataPlan(networkCode);

    if (!selectedPlan || selectedPlan.length === 0) {
      throw new BadRequestError("No data plans found for the selected network");
    }

    const plan = selectedPlan.find((plan) => plan.planCode === planCode);

    if (wallet.balance - Number(plan?.amount!) < 0) {
      throw new BadRequestError("Insufficient wallet balance");
    }

    wallet.balance -= Number(plan?.amount);

    const payload: Payflex.BuyDataPayload = {
      network: networkCode,
      mobile_number: parsed.data.phone,
      plan_code: planCode,
    };
    const response = await payflexApi.buyData(payload);
    await wallet.save();

    resp.status(StatusCodes.OK).json({
      success: true,
      message: "Data purchased successfully.",
      data: response,
    });
  });

  getNetworkList = asyncWrapper(async (req: Request, resp: Response) => {
    const response = await payflexApi.retrieveNetworkLists();

    resp.status(StatusCodes.OK).json({
      success: true,
      message: "Network lists retrieved successfully.",
      data: response,
    });
  });

  getDataPlan = asyncWrapper(async (req: Request, resp: Response) => {
    const { planId } = req.params;
    if (!planId) {
      throw new BadRequestError("Plan ID is required");
    }
    console.log("Plan ID:", planId);
    const response = await payflexApi.retrieveDataPlan(planId as string);

    resp.status(StatusCodes.OK).json({
      success: true,
      message: "Data plan retrieved successfully.",
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
