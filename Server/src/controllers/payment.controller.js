import {
  createOrderService,
  validateWebhookService,
} from "../services/payment.service.js";
import { asyncHandler, ApiError, ApiResponse } from "../utils/index.js";

export const createOrder = asyncHandler(async (req, res, next) => {
  try {
    const { subscriptionsType } = req.body;
    const user = req.user;

    const order = await createOrderService(user, subscriptionsType);

    return res.json(new ApiResponse(200, order, "Order created successfully."));
  } catch (error) {
    if (error instanceof ApiError) throw error;
    return next(new ApiError(500, "Internal error!!!", error.message));
  }
});

export const validateWebhook = asyncHandler(async (req, res, next) => {
  try {
    const body = JSON.stringify(req.body);
    const webhookSignature = req.get("X-Razorpay-Signature");
    console.log(webhookSignature);

    const webhook = await validateWebhookService(body, webhookSignature);

    return res.json(
      new ApiResponse(200, webhook, "Webhook validate successfully.")
    );
  } catch (error) {
    if (error instanceof ApiError) throw error;
    return next(new ApiError(500, "Internal error!!!", error.message));
  }
});
