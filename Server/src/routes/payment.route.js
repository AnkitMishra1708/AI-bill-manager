import express from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { createOrder } from "../controllers/payment.controller.js";

const router = express.Router();

router.route("/order").post(verifyJwt, createOrder);

export default router;
