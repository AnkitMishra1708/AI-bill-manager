import { createOrderService } from "../services/payment.service.js";
import { asyncHandler, ApiError, ApiResponse } from "../utils/index.js";

export const createOrder = asyncHandler(async (req, res, next) => {
  try {
    const { subscriptionsType } = req.body;
    const user = req.user;
    const order = await createOrderService(user, subscriptionsType);
    console.log(order);

    return res.json(new ApiResponse(200, order, "Order created successfully."));
  } catch (error) {
    if (error instanceof ApiError) throw error;
    return next(new ApiError(500, "Internal error!!!", error.message));
  }
});
