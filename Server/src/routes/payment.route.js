import express from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { createOrder, validateWebhook } from "../controllers/payment.controller.js";

const router = express.Router();

router.route("/order").post(verifyJwt, createOrder);
router.route("/webhook").post(validateWebhook);

export default router;
