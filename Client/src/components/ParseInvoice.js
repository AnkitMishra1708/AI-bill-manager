import { extractInvoiceApi } from "../api/invoice";

export const parseInvoice = async (file) => {
  const imageUrl = new FormData();

  imageUrl.append("imageUrl", file);

  return await extractInvoiceApi(imageUrl);
};
