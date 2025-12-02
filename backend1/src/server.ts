import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { connectDB } from "./config/db";
import { setupSwagger } from "./config/swagger";
import authRoutes from "./routes/auth.routes";
import noteRoutes from "./routes/note.routes";
import { errorHandler } from "./middleware/error.middleware";

const app = express();

// middlewares
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

// swagger
setupSwagger(app);

// basic route
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

// api routes
app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);

// error middleware
app.use(errorHandler);

// start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server running on port ${PORT}`);
});
