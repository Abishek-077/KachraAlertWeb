import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import authRoutes from "./routes/authRoutes.js";
import alertRoutes from "./routes/alertsRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import invoiceRoutes from "./routes/invoiceRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import schedulesRoutes from "./routes/schedulesRoutes.js";
import adminUsersRoutes from "./routes/adminUsersRoutes.js";
import messagesRoutes from "./routes/messagesRoutes.js";
import serviceRatingsRoutes from "./routes/serviceRatingsRoutes.js";
import { errorHandler } from "./middleware/error.js";
import { isAllowedCorsOrigin } from "./utils/origin.js";
import { env } from "./config/env.js";

const app = express();

if (env.nodeEnv === "production") {
  // Respect X-Forwarded-* headers when running behind a reverse proxy.
  app.set("trust proxy", 1);
}

app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      if (isAllowedCorsOrigin(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true
  })
);
app.use(express.json({ limit: "12mb" }));
app.use(cookieParser());
app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));

app.get("/api/v1/health", (_req, res) => {
  res.json({ success: true, message: "OK" });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/alerts", alertRoutes);
app.use("/api/v1/reports", reportRoutes);
app.use("/api/v1/invoices", invoiceRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/schedules", schedulesRoutes);
app.use("/api/v1/admin", adminUsersRoutes);
app.use("/api/v1/messages", messagesRoutes);
app.use("/api/v1/service-ratings", serviceRatingsRoutes);

app.use(errorHandler);

export default app;
