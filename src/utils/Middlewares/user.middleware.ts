import { NextFunction, Request, Response } from "express";
import { BadRequestError } from "../ApiError";
import configs from "../configs";
import webToken, { JwtPayload } from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import User from "../../models/user.model";
import Profile from "../../models/profile.model";

const userMiddleWare = async (
  req: any,
  _resp: Response,
  next: NextFunction
) => {
  const payload = req.headers.authorization;
  if (!payload) {
    throw new BadRequestError("Authorization token not found");
  }
  const userToken = payload.split(" ")[1];

  const token = webToken.decode(userToken) as JwtPayload;

  if (!token) {
    throw new BadRequestError("Invalid token");
  }

  const user = await User.findOne({
    where: {
      uid: token.uid,
    },
  });
  if (!user) {
    throw new BadRequestError("User not found");
  }

  const profile = await Profile.findOne({
    where: {
      userUid: user.uid,
    },
  });
  if (!profile?.is_active) {
    throw new BadRequestError("User account not active");
  }
  req.profile = profile;
  req.user = user;

  next();
};

export default userMiddleWare;
