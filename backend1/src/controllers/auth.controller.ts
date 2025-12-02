import { Request, Response, NextFunction } from "express";
import { User } from "../models/user.model";
import { generateAccessToken, generateRefreshToken } from "../utils/token.util";
import jwt from "jsonwebtoken";

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already used" });

    const user = await User.create({ name, email, password });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.status(201).json({ user, accessToken, refreshToken });
  } catch (err) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.json({ user, accessToken, refreshToken });
  } catch (err) {
    next(err);
  }
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ message: "Token required" });

    const decoded = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET as string
    ) as { sub: string };

    const user = await User.findById(decoded.sub);
    if (!user) return res.status(404).json({ message: "User not found" });

    const accessToken = generateAccessToken(user);
    res.json({ accessToken });
  } catch (err) {
    next(err);
  }
};
