import { razorpayInstance } from "../utils/razorpay.js";
import { Payment } from "../models/payment.model.js";
import { subscriptionPlan, subscriptionToken } from "../utils/constants.js";
import { validateWebhookSignature } from "razorpay/dist/utils/razorpay-utils.js";
import { User } from "../models/user.model.js";

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

    console.log("Body 1:",parsedBody);
  
    if (isWebhookValid) {
      const { event, payload } = parsedBody;
      console.log("Body 2:",event,payload);
      
      switch (event) {
        case "payment.captured":
          await handleyourCapturedLogic(payload);
          break;
        case "payment.failed":
          await handleyourFailedLogic(payload);
          break;
        default:
          console.log(`Unhandled event: ${event}`);
          break;
      }
    }

    return isWebhookValid;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, "Something went wrong.", [error.message]);
  }
};

const handleyourCapturedLogic = async (payload) => {
  const paymentEntity = payload?.payment?.entity;
  console.log(paymentEntity);

  const plan = paymentEntity?.notes?.subscriptionsType;
  const tokensToAdd = subscriptionToken[plan];

  const updatedUserToken = await User.findOneAndUpdate(
    { _id: paymentEntity?.notes?.userId },
    { $inc: { uploadCount: tokensToAdd } },
    { returnDocument: "after" }
  );

  const updatedPayment = await Payment.findOneAndUpdate(
    {
      orderId: paymentEntity?.order_id,
      userId: paymentEntity?.notes?.userId,
    },
    {
      $set: {
        paymentId: paymentEntity?.id,
        paymentMethod: paymentEntity?.method,
        status: paymentEntity?.status,
      },
    },
    { returnDocument: "after" }
  );
};

const handleyourFailedLogic = async (payload) => {
  const paymentEntity = payload?.payment?.entity;

  const updatedPayment = await Payment.findOneAndUpdate(
    {
      orderId: paymentEntity?.order_id,
      userId: paymentEntity?.notes?.userId,
    },
    {
      $set: {
        paymentId: paymentEntity?.id,
        paymentMethod: paymentEntity?.method,
        status: paymentEntity?.status,
      },
    },
    { returnDocument: "after" }
  );
};
