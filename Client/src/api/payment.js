import api from "./axios";

export const createOrderApi = (payload) => {
  return api.post("/payment/order", payload);
};
export const VerifyPaymentApi = (payload) => {
  return api.post("/payment/verify-payment", payload);
};
