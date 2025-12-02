"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshToken = exports.login = exports.register = void 0;
const user_model_1 = require("../models/user.model");
const token_util_1 = require("../utils/token.util");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const existing = await user_model_1.User.findOne({ email });
        if (existing)
            return res.status(400).json({ message: "Email already used" });
        const user = await user_model_1.User.create({ name, email, password });
        const accessToken = (0, token_util_1.generateAccessToken)(user);
        const refreshToken = (0, token_util_1.generateRefreshToken)(user);
        res.status(201).json({ user, accessToken, refreshToken });
    }
    catch (err) {
        next(err);
    }
};
exports.register = register;
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await user_model_1.User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const accessToken = (0, token_util_1.generateAccessToken)(user);
        const refreshToken = (0, token_util_1.generateRefreshToken)(user);
        res.json({ user, accessToken, refreshToken });
    }
    catch (err) {
        next(err);
    }
};
exports.login = login;
const refreshToken = async (req, res, next) => {
    try {
        const { token } = req.body;
        if (!token)
            return res.status(400).json({ message: "Token required" });
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_REFRESH_SECRET);
        const user = await user_model_1.User.findById(decoded.sub);
        if (!user)
            return res.status(404).json({ message: "User not found" });
        const accessToken = (0, token_util_1.generateAccessToken)(user);
        res.json({ accessToken });
    }
    catch (err) {
        next(err);
    }
};
exports.refreshToken = refreshToken;
