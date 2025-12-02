import jwt from "jsonwebtoken";
import { IUser } from "../models/user.model";

export const generateAccessToken = (user: IUser) => {
  return jwt.sign(
    { sub: user._id, email: user.email },
    process.env.JWT_ACCESS_SECRET as string,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRES || "15m" }
  );
};

export const generateRefreshToken = (user: IUser) => {
  return jwt.sign(
    { sub: user._id },
    process.env.JWT_REFRESH_SECRET as string,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES || "7d" }
  );
};
