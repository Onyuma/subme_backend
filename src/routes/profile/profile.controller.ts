import asyncWrapper from "../../utils/asyncwrapper";
import { Request, Response } from "express";
import webToken, { JwtPayload } from "jsonwebtoken";
import { BadRequestError } from "../../utils/ApiError";
import configs from "../../utils/configs";
import { StatusCodes } from "http-status-codes";
import Profile from "../../models/profile.model";
import { Op } from "sequelize";
import { convertObjectKeysToCamelCase } from "../../utils/snaketocamelconverter";
import User from "../../models/user.model";

class ProfileController {
  getUserProfile = asyncWrapper(async (req: Request, res: Response) => {
    const payload = req.headers.authorization;
    if (!payload) {
      throw new BadRequestError("Authorization token not found");
    }
    const userToken = payload.split(" ")[1];

    const token = webToken.verify(
      userToken,
      configs.JWT_SECRET_KEY!
    ) as JwtPayload;

    if (!token) {
      throw new BadRequestError("Invalid token");
    }

    const profile = await Profile.findOne({
      where: {
        userUid: token?.uid,
      },
      attributes: { exclude: ["createdAt", "updatedAt", "userUid"] },
      include: User,
    });
    if (!profile) {
      throw new BadRequestError("User profile not found");
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: "User profile retreived successfully",
      data: {
        profile: convertObjectKeysToCamelCase(profile.toJSON()),
      },
    });
  });

  getUserDetails = asyncWrapper(async (req: Request, res: Response) => {
    const phone = req.query.phone;

    if (!phone) {
      throw new BadRequestError("Phone number not found");
    }

    const userPhone = String(phone).trim();
    const phoneNumber = userPhone.length == 11 ? userPhone.slice(1) : userPhone;

    const profile = await Profile.findOne({
      where: {
        phone_number: `0${phoneNumber}`,
      },
      attributes: {
        include: ["uid", "first_name", "last_name", "phone_number"],
      },
    });

    if (!profile) {
      throw new BadRequestError("User profile not found");
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: "User details retreived successfully",
      data: convertObjectKeysToCamelCase(profile.toJSON()),
    });
  });
}

const profileController = new ProfileController();
export default profileController;
