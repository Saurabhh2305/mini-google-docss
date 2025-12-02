"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendShareEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});
const sendShareEmail = async (to, noteId) => {
    const url = `${process.env.CLIENT_URL}/notes/${noteId}`;
    await transporter.sendMail({
        from: process.env.SMTP_USER,
        to,
        subject: "A note was shared with you",
        text: `A note was shared with you. Open: ${url}`
    });
};
exports.sendShareEmail = sendShareEmail;
