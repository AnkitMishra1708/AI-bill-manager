import express from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  groqParse,
  saveBillToDb,
  allInvoice,
  detailedInvoice,
  deleteInvoice,
} from "../controllers/invoice.controller.js";

const router = express.Router();

router
  .route("/groqParse")
  .post(verifyJwt, upload.single("imageUrl"), groqParse);
router.route("/save").post(verifyJwt, saveBillToDb);
router.route("/all-invoice").get(verifyJwt, allInvoice);
router.route("/detailed-invoice/:id").get(verifyJwt, detailedInvoice);
router.route("/delete-invoice/:id").get(verifyJwt, deleteInvoice);

export default router;
