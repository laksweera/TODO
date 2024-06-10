import express from "express";
const router = express.Router();

import userController from "../controllers/user.controller.js";

import userAuthentication from "../middleware/userAuthentication.js";



router.post("/register", userController.registerUser);
router.post("/login", userController.userLogin);
router.delete("/deleteUser/:id", userAuthentication,userController.deleteUser);
router.get("/getUser/:id", userController.getUserById);
router.post("/ChangeUserPassword/:id", userController.changeUserPassword);
router.post("/sendOTP", userController.sendOTP);
router.put("/ChangePasswordWithOtp/:id", userController.ChangePasswordWithOtp);
export default router;
