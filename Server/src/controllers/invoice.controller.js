import { extractInvoiceDataFromGroq } from "../services/groqAI.service.js";
import { asyncHandler, ApiResponse, ApiError } from "../utils/index.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Invoice } from "../models/invoice.model.js";
import { tokenCountVerify } from "../services/Invoice.service.js";

export const groqParse = asyncHandler(async (req, res, next) => {
  try {
    const imgLocalPath = req.file?.path;
    const userId = req.user._id;

    const newToken = await tokenCountVerify(userId);

    if (!imgLocalPath) {
      return next(new ApiError(400, "Please provide us an image file."));
    }

    const CloudinaryData = await uploadOnCloudinary(imgLocalPath);
    const billCloudinaryUrl = CloudinaryData.secure_url;

    if (!billCloudinaryUrl) {
      return next(new ApiError(400, "Please provide us an image file."));
    }

    const extractedData = await extractInvoiceDataFromGroq(billCloudinaryUrl);

    return res.json(
      new ApiResponse(
        200,
        { extractedData, newToken },
        "Invoice extracted successfully."
      )
    );
  } catch (error) {
    if (error instanceof ApiError) throw error;
    return next(new ApiError(500, "Internal error!!!", error.message));
  }
});

export const saveBillToDb = asyncHandler(async (req, res, next) => {
  try {
    const {
      imageUrl,
      invoiceNumber,
      invoiceName,
      totalAmount,
      invoiceDate,
      productList,
    } = req.body;

    if (!(imageUrl, totalAmount, invoiceNumber || invoiceName, productList)) {
      return next(new ApiError(404, "Information Missing."));
    }

    const newInvoice = await Invoice.create({
      user: req.user._id,
      imageUrl,
      invoiceNumber: invoiceNumber || "N/A",
      invoiceName,
      totalAmount,
      invoiceDate: invoiceDate || "N/A",
      productList: productList || [],
    });

    const createdInvoice = await newInvoice.save();

    return res.json(
      new ApiResponse(200, createdInvoice, "Invoice created successfully.")
    );
  } catch (error) {
    return next(new ApiError(500, "Internal error!!!", [error.message]));
  }
});

export const allInvoice = asyncHandler(async (req, res, next) => {
  try {
    const user = req.user._id;

    const allInvoice = await Invoice.find({ user: user });

    return res.json(
      new ApiResponse(200, allInvoice, "All Invoice fetched successfully.")
    );
  } catch (error) {
    return next(new ApiError(500, "Internal error!!!", [error.message]));
  }
});

export const detailedInvoice = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;
    const detailedInvoice = await Invoice.findById(id);
    return res.json(
      new ApiResponse(
        200,
        detailedInvoice,
        "Detailed Invoice fetched successfully."
      )
    );
  } catch (error) {
    return next(new ApiError(500, "Internal error!!!", [error.message]));
  }
});

export const deleteInvoice = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;
    await Invoice.deleteOne({ _id: id });
    return res.json(new ApiResponse(200, {}, "Invoice deleted successfully."));
  } catch (error) {
    return next(new ApiError(500, "Internal error!!!", [error.message]));
  }
});
