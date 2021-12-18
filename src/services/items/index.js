import express from "express";
import item from "./itemsHandlers.js";
import multer from "multer";
import cloudStorage from "../../lib/cloudStorage.js";
import { itemsValidationMiddleware } from "../../lib/validations.js";
import { JWTAuthMiddleware } from "../../auth/token.js";

const itemsRouter = express.Router();

itemsRouter
  .route("/")
  .get(item.getItems)
  .post(JWTAuthMiddleware, itemsValidationMiddleware, item.postItem);

itemsRouter
  .route("/:itemId")
  .get(item.getItem)
  .put(item.putItem)
  .delete(item.deleteItem)
  .post(
    JWTAuthMiddleware,
    multer({ storage: cloudStorage }).single("image"),
    item.postImage
  );

itemsRouter
  .route("/:itemId/comments")
  .get(item.getComments)
  .post(item.postComment);

itemsRouter
  .route("/:itemId/comments/:commentId")
  .put(item.putComment)
  .delete(item.deleteComment);

export default itemsRouter;
