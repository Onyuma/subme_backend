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

  postTransferFunds = asyncWrapper(async (req: Request, resp: Response) => {
    const { senderUid, recipientUid, amount } = req.body;
    if (
      !senderUid ||
      typeof senderUid !== "string" ||
      !recipientUid ||
      typeof recipientUid !== "string" ||
      !amount
    ) {
      throw new BadRequestError(
        "Sender ID, recipient ID, and amount are required"
      );
    }
    if (recipientUid === senderUid) {
      throw new BadRequestError("Sender and recipient cannot be the same");
    }
    const parsedAmount = parseFloat(amount);
    if (typeof parsedAmount !== "number" || parsedAmount <= 0) {
      throw new BadRequestError("Invalid amount");
    }
    const sender = await User.findOne({
      where: {
        uid: senderUid,
      },
    });
    if (!sender) {
      throw new BadRequestError("Sender not found");
    }
    const senderProfile = await sender.getProfile();
    if (!senderProfile) {
      throw new BadRequestError("Sender profile not found");
    }
    if (!senderProfile.is_active) {
      throw new BadRequestError(
        "Sender account deactivated. Please contact support."
      );
    }
    const senderWallet = await sender.getWallet();
    if (!senderWallet) {
      throw new BadRequestError("Sender wallet not found");
    }
    if (
      senderWallet.balance < parsedAmount ||
      senderWallet.balance - parsedAmount < 0
    ) {
      throw new BadRequestError("Insufficient funds in sender's wallet");
    }
    const recipient = await User.findOne({
      where: {
        uid: recipientUid,
      },
    });
    if (!recipient) {
      throw new BadRequestError("Recipient not found");
    }
    const recipientProfile = await recipient.getProfile();
    if (!recipientProfile) {
      throw new BadRequestError("Recipient profile not found");
    }
    if (!recipientProfile.is_active) {
      throw new BadRequestError(
        "Recipient account deactivated. Please contact support."
      );
    }
    const recipientWallet = await recipient.getWallet();
    if (!recipientWallet) {
      throw new BadRequestError("Recipient wallet not found");
    }

    senderWallet.balance -= parsedAmount;
    recipientWallet.balance += parsedAmount;
    await senderWallet.save();
    await recipientWallet.save();

    resp.status(StatusCodes.OK).json({
      success: true,
      message: "Funds transferred successfully",
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
