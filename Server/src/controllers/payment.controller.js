import {
  createOrderService,
  validateWebhookService,
  verifyPaymentService,
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
    const body = req.rawBody;
    const webhookSignature = req.get("X-Razorpay-Signature");

    const webhook = await validateWebhookService(body, webhookSignature);

    return res.json(
      new ApiResponse(200, webhook, "Webhook validate successfully.")
    );
  } catch (error) {
    if (error instanceof ApiError) throw error;
    return next(new ApiError(500, "Internal error!!!", error.message));
  }
});

export const verifyPayment = asyncHandler(async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;
    const user = req.user;

    const isVerify = await verifyPaymentService(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      user
    );

    if (isVerify.signatureIsVerify) {
      return res.json(
        new ApiResponse(
          200,
          { status: "success", isVerify },
          "Payment successfull."
        )
      );
    } else {
      return res.json(
        new ApiResponse(200, { status: "failed" }, "Payment failed.")
      );
    }
  } catch (error) {
    if (error instanceof ApiError) throw error;
    return next(new ApiError(500, "Internal error!!!", error.message));
  }
});
