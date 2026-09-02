import { razorpayInstance } from "../utils/razorpay.js";
import { Payment } from "../models/payment.model.js";
import { subscriptionPlan, subscriptionToken } from "../utils/constants.js";
import { validateWebhookSignature } from "razorpay/dist/utils/razorpay-utils.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import crypto from "crypto";

export const createOrderService = async (user, subscriptionsType) => {
  try {
    const order = await razorpayInstance.orders.create({
      amount: subscriptionPlan[subscriptionsType] * 100,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
      notes: {
        userId: user._id.toString(),
        fullName: user.fullName,
        email: user.email,
        subscriptionsType: subscriptionsType,
      },
    });

    const paymentSaved = await Payment.create({
      userId: user._id,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      notes: {
        userId: order.notes.userId,
        email: order.notes.email,
        fullName: order.notes.fullName,
        subscriptionsType: order.notes.subscriptionsType,
      },
      status: order.status,
    });

    return { paymentSaved };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, "Something went wrong.", [error.message]);
  }
};

export const validateWebhookService = async (body, webhookSignature) => {
  try {
    const isWebhookValid = validateWebhookSignature(
      body,
      webhookSignature,
      process.env.RAZORPAY_WEBHOOK_SECRET
    );

    if (!isWebhookValid) {
      throw new ApiError(400, "Webhook signature is invalid.");
    }

    const parsedBody = JSON.parse(body);

    if (isWebhookValid) {
      const { event, payload } = parsedBody;

      switch (event) {
        case "payment.captured":
          await handleCapturedLogic(payload);
          break;
        case "payment.failed":
          await handleFailedLogic(payload);
          break;
        default:
          throw new ApiError(400, "Payment event not recognized.");
      }
    }

    return isWebhookValid;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, "Something went wrong.", [error.message]);
  }
};

export const verifyPaymentService = async (
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature
) => {
  const sign = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSign = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(sign.toString())
    .digest("hex");

  if (razorpay_signature === expectedSign) {
    return true;
  } else {
    return false;
  }
};

const handleCapturedLogic = async (payload) => {
  const paymentEntity = payload?.payment?.entity;

  const plan = paymentEntity?.notes?.subscriptionsType;
  const tokensToAdd = subscriptionToken[plan];

  await User.findOneAndUpdate(
    { _id: paymentEntity?.notes?.userId },
    { $inc: { uploadCount: tokensToAdd } },
    { returnDocument: "after" }
  );

  await Payment.findOneAndUpdate(
    {
      orderId: paymentEntity?.order_id,
      userId: paymentEntity?.notes?.userId,
    },
    {
      $set: {
        paymentId: paymentEntity?.id,
        subscriptionsType: paymentEntity?.notes?.subscriptionsType,
        paymentMethod: paymentEntity?.method,
        status: paymentEntity?.status,
      },
    },
    { returnDocument: "after" }
  );
};

const handleFailedLogic = async (payload) => {
  const paymentEntity = payload?.payment?.entity;

  await Payment.findOneAndUpdate(
    {
      orderId: paymentEntity?.order_id,
      userId: paymentEntity?.notes?.userId,
    },
    {
      $set: {
        paymentId: paymentEntity?.id,
        subscriptionsType: paymentEntity?.notes?.subscriptionsType,
        paymentMethod: paymentEntity?.method,
        status: paymentEntity?.status,
      },
    },
    { returnDocument: "after" }
  );
};
