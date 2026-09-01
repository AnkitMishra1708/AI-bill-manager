import { razorpayInstance } from "../utils/razorpay.js";
import { Payment } from "../models/payment.model.js";
import { subscriptionPlan } from "../utils/constants.js";

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
