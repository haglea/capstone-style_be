import createHttpError from "http-errors";
import { verifyJWT } from "./tools.js";
import UserModel from "../db/models/user.js";

export const JWTAuthMiddleware = async (req, res, next) => {
  console.log(req.headers.authorization);
  if (!req.headers.authorization) {
    next(
      createHttpError(
        401,
        "Please provide credentials in Authorization header!"
      )
    );
  } else {
    try {
      const token = req.headers.authorization.replace("Bearer ", "");
      const decodedToken = await verifyJWT(token);
      console.log(decodedToken);

      const user = await UserModel.findById(decodedToken._id);
      console.log(decodedToken._id);
      if (user) {
        req.user = user;
        next();
      } else {
        next(createHttpError(404, "User not found!"));
      }
    } catch (error) {
      next(createHttpError(401, "Token not valid!"));
    }
  }
};