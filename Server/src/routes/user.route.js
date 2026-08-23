import express from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import {
  register,
  login,
  logoutUser,
  getCurrentUser,
  refreshAccessToken,
} from "../controllers/user.controller.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout-user").post(verifyJwt, logoutUser);
router.route("/get-current-user").get(verifyJwt, getCurrentUser);
router.route("/refresh-access-token").post(refreshAccessToken);

export default router;
