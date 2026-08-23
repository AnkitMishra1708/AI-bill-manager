import api from "./axios";

export const extractInvoiceApi = (imageUrl) => {
  return api.post("/invoice/groqParse", imageUrl);
};

export const saveInvoiceApi = (payload) => {
  return api.post("/invoice/save", payload);
};

export const allInvoiceApi = () => {
  return api.get("/invoice/all-invoice");
};

export const detailedInvoiceApi = (id) => {
  return api.get(`/invoice/detailed-invoice/${id}`);
};
