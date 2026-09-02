import api from "./axios";

export const createOrderApi = (payload) => {
  return api.post("/payment/order", payload);
};
export const VerifyPaymentApi = () => {
  return api.get("/payment/verify-payment");
};
