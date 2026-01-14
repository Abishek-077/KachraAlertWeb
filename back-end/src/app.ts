import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import authRoutes from "./routes/authRoutes.js";
import { errorHandler } from "./middleware/error.js";
import { env } from "./config/env.js";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.frontendUrl,
    credentials: true
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.get("/api/v1/health", (_req, res) => {
  res.json({ success: true, message: "OK" });
});

app.use("/api/v1/auth", authRoutes);

app.use(errorHandler);

export default app;
