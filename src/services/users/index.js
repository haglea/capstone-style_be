import express from "express";
import user from "./usersHandlers.js";
import multer from "multer";
import cloudStorage from "../../lib/cloudStorage.js";
import {
  signupValidationMiddleware,
  loginValidationMiddleware,
} from "../../lib/validations.js";
import { JWTAuthMiddleware } from "../../auth/token.js";

const usersRouter = express.Router();

usersRouter.route("/").get(loginValidationMiddleware, user.getUsers);

usersRouter.route("/register").post(signupValidationMiddleware, user.postUser);

usersRouter.route("/login").post(user.loginUser);

usersRouter
  .route("/me")
  .get(JWTAuthMiddleware, user.getMe)
  .put(JWTAuthMiddleware, user.putMe)
  .delete(JWTAuthMiddleware, user.deleteMe)
  .post(
    JWTAuthMiddleware,
    multer({ storage: cloudStorage }).single("image"),
    user.uploadImage
  );

usersRouter.route("/:userId").get(user.getUser);

export default usersRouter;
