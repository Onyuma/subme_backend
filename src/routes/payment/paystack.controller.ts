import { Request, Response } from "express";
import { Paystack } from "../../types";
import paystackApi from "../../services/paystack.api";
import { StatusCodes } from "http-status-codes";
import asyncWrapper from "../../utils/asyncwrapper";
import { BadRequestError } from "../../utils/ApiError";

class PaystackController {
  initiatePayment = asyncWrapper(async (req: Request, res: Response) => {
    const { email, amount, callbackUrl, name } = req.body;

    const paymentData: Paystack.InitializeTransactionArgs = {
      email,
      amount,
      callback_url: callbackUrl,
      metadata: {
        name,
        email,
        amount,
      },
    };

    const data = await paystackApi.initialize(paymentData);
    res.status(StatusCodes.OK).json({
      status: "success",
      message: "Payment initiated successfully",
      data,
    });
  });

  verifyPayment = asyncWrapper(async (req: Request, res: Response) => {
    if (!req.query.reference || typeof req.query.reference !== "string") {
      throw new BadRequestError(
        "Reference query parameter is required or parameter must be a string"
      );
    }
    const { reference: ref } = req.query;
    const {
      data: {
        reference,
        status: paymentStatus,
        metadata: { name, email, amount },
      },
    } = await paystackApi.verify(ref);

    if (paymentStatus != "success") {
      throw new BadRequestError(`Transaction: ${paymentStatus}`);
    }

    res.status(StatusCodes.OK).json({
      status: "success",
      message: "Payment verified successfully",
      data: {
        name,
        email,
        amount,
        reference,
      },
    });
  });
}

const paystackController = new PaystackController();
export default paystackController;
