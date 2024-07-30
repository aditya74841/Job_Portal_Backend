import express from "express";
import {
  changeCurrentPassword,
  forgotPasswordRequest,
  login,
  logout,
  register,
  updateProfile,
} from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/mutler.js";

const router = express.Router();

router.route("/register").post(singleUpload, register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router
  .route("/profile/update")
  .post(isAuthenticated, singleUpload, updateProfile);
router.route("/forgot-password").post(isAuthenticated, forgotPasswordRequest);
router.route("/change-password").post(isAuthenticated, changeCurrentPassword);
router.route("/getProfile").post(isAuthenticated, changeCurrentPassword);

export default router;
