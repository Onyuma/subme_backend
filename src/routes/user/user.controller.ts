import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import asyncWrapper from "../../utils/asyncwrapper";
import User from "../../models/user.model";
import { BadRequestError, ZodError } from "../../utils/ApiError";
import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcryptjs";
import configs from "../../utils/configs";
import { LoginUserScheme } from "../../types";
import { success } from "zod";

class UserController {
  postRegisterUser = asyncWrapper(async (req: Request, resp: Response) => {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password || !phone) {
      throw new BadRequestError("All fields are required");
    }

    const [firstName, ...lastName] = name.trim().split(" ");
    const registeredUser = await User.findOne({
      where: {
        email,
      },
    });
    if (registeredUser) {
      throw new BadRequestError("User with this email already exists");
    }
    const user = await User.create({
      email,
      password,
    });

    if (!user) {
      throw new BadRequestError("User registration failed");
    }
    const profile = await (
      user as typeof user & { createProfile: Function }
    ).createProfile({
      first_name: firstName,
      last_name: lastName.join(" "),
      phone_number: phone,
    });
    if (!profile) {
      throw new BadRequestError("User profile creation failed");
    }
    const wallet = await (
      user as typeof user & { createWallet: Function }
    ).createWallet();

    if (!wallet) {
      throw new BadRequestError("User wallet creation failed");
    }
    const webtoken = jsonwebtoken.sign(
      { uid: user.uid },
      configs.JWT_SECRET_KEY as string
    );
    resp.status(StatusCodes.CREATED).json({
      success: true,
      message: "User registered successfully",
      data: {
        token: webtoken,
        user: {
          uid: user.uid,
          name,
          email: user.email,
          phone,
        },
      },
    });
  });

  postLoginUser = asyncWrapper(async (req: Request, resp: Response) => {
    const parsed = LoginUserScheme.safeParse(req.body);
    if (parsed.error) {
      throw new ZodError(parsed.error.issues);
    }

    const user = await User.findOne({
      where: {
        email: parsed.data.email,
      },
    });

    if (!user) {
      throw new BadRequestError("User not found");
    }
    const checkPassword = await bcrypt.compare(
      parsed.data.password,
      user.password
    );
    if (!checkPassword) {
      throw new BadRequestError(
        "Invalid credientials, check your entries and try again"
      );
    }
    const webtoken = jsonwebtoken.sign(
      { uid: user.uid },
      configs.JWT_SECRET_KEY as string
    );

    resp.status(StatusCodes.OK).json({
      success: true,
      message: "User logged in successfully",
      token: webtoken,
    });
  });

  getDeactivateUser = asyncWrapper(async (req: Request, resp: Response) => {
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
    const profile = await user.getProfile();
    if (!profile) {
      throw new BadRequestError("User profile not found");
    }
    const status = profile.is_active ? "deactivated" : "activated";
    profile.is_active = profile.is_active ? false : true;

    await profile.save();
    resp.status(StatusCodes.OK).json({
      success: true,
      message: `User ${status} successfully`,
    });
  });
}

const userController = new UserController();
export default userController;
