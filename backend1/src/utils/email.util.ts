import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export const sendShareEmail = async (to: string, noteId: string) => {
  const url = `${process.env.CLIENT_URL}/notes/${noteId}`;
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject: "A note was shared with you",
    text: `A note was shared with you. Open: ${url}`
  });
};
