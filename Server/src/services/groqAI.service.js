import Groq from "groq-sdk";
import { ApiError } from "../utils/index.js";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const promptText = `
Analyze the provided image and determine whether it is a valid store bill, receipt, or invoice.

Return ONLY valid JSON. No markdown, no explanation, no thinking.

If invalid, return:
{
  "isValidBill": false,
  "message": "The uploaded image is not a valid bill or invoice."
}

If valid, return:
{
  "isValidBill": true,
  "invoiceNumber": "string or null",
  "invoiceName": "string or null",
  "totalAmount": 0,
  "invoiceDate": "YYYY-MM-DD or null",
  "productList": [
    {
      "productName": "string",
      "productQuantity": 0,
      "unitPrice": 0,
      "totalPrice": 0
    }
  ]
}

Rules:
- Do not invent missing values.
- Use null when unavailable.
- Numbers must be numbers, not strings.
- Extract values exactly as printed.
`;

export const extractInvoiceDataFromGroq = async (imageUrl) => {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: promptText,
            },
            {
              type: "image_url",
              image_url: {
                url: imageUrl,
              },
            },
          ],
        },
      ],
      model: "qwen/qwen3.6-27b",
      reasoning_effort: "none",
      response_format: {
        type: "json_object",
      },
      max_completion_tokens: 2048,
    });

    const content = chatCompletion.choices[0].message.content;
    const parsedData = JSON.parse(content);
    return {
      imageUrl,
      parsedData,
    };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, "Something went wrong while scanning image.", [
      error.message,
    ]);
  }
};
