import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { errorHandler } from "./middlewares/errorMiddleware.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(
  express.json({
    limit: "50mb",
    verify: (req, res, buf) => {
      req.rawBody = buf.toString();
    },
  })
);
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.static("public"));
app.use(cookieParser());

import userRoute from "./routes/user.route.js";
import invoiceRoute from "./routes/invoice.route.js";
import paymentRoute from "./routes/payment.route.js";

app.use("/api/v1/users", userRoute);
app.use("/api/v1/invoice", invoiceRoute);
app.use("/api/v1/payment", paymentRoute);
app.use(errorHandler);

export { app };
