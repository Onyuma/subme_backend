import { Request, Response } from "express";
import User from "../../models/user.model";
import { BadRequestError } from "../../utils/ApiError";
import asyncWrapper from "../../utils/asyncwrapper";
import { StatusCodes } from "http-status-codes";

class WalletController {
  postFundWallet = asyncWrapper(async (req: Request, resp: Response) => {
    const { uid, amount } = req.body;
    if (!uid || typeof uid !== "string" || !amount) {
      throw new BadRequestError("User ID and amount are required");
    }
    const parsedAmount = parseFloat(amount);

    if (typeof parsedAmount !== "number" || parsedAmount <= 0) {
      throw new BadRequestError("Invalid amount");
    }
    const user = await User.findOne({
      where: {
        uid,
      },
    });
    if (!user) {
      throw new BadRequestError("User not found");
    }
    const profile = await user.getProfile();
    if (!profile) {
      throw new BadRequestError("User profile not found");
    }
    if (!profile.is_active) {
      throw new BadRequestError(
        "User account deactivated. Please contact support."
      );
    }
    const wallet = await user.getWallet();
    if (!wallet) {
      throw new BadRequestError("User wallet not found");
    }

    wallet.balance += parsedAmount;
    await wallet.save();

    resp.status(StatusCodes.OK).json({
      success: true,
      message: "Wallet funded successfully",
      data: {
        wallet,
      },
    });
  });

  getWalletBalance = asyncWrapper(async (req: Request, resp: Response) => {
    const { uid } = req.query;
    if (!uid || typeof uid !== "string") {
      throw new BadRequestError("User ID is required");
    }
    const user = await User.findOne({
      where: {
        uid,
      },
    });
    if (!user) {
      throw new BadRequestError("User not found");
    }
    const wallet = await user.getWallet();
    if (!wallet) {
      throw new BadRequestError("User wallet not found");
    }
    // Implement logic to retrieve wallet balance here
    const balance = wallet.balance;

    resp.status(StatusCodes.OK).json({
      success: true,
      message: "Wallet balance retrieved successfully",
      data: {
        balance,
      },
    });
  });
}

const walletController = new WalletController();
export default walletController;
