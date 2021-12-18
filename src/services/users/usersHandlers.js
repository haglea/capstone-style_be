import UserModel from "../../db/models/user.js";
import createHttpError from "http-errors";
import { validationResult } from "express-validator";
import { JWTAuthenticate } from "../../auth/tools.js";
import q2m from "query-to-mongo";

const getUsers = async (req, res, next) => {
  try {
    const query = q2m(req.query);
    const total = await UserModel.countDocuments(query.criteria);
    const users = await UserModel.find(query.criteria, query.options.fields)
      .limit(query.options.limit)
      .skip(query.options.skip)
      .sort(query.options.sort);

    res.send({
      links: query.links("/users", total),
      total,
      users,
      pageTotal: Math.ceil(total / query.options.limit),
    });
  } catch (error) {
    next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    const errorList = validationResult(req);
    if (errorList.isEmpty()) {
      const newUser = new UserModel(req.body);
      const createdUser = await newUser.save();
      const { accessToken } = await JWTAuthenticate(createdUser);
      res.status(201).send(createdUser);
    } else {
      return res.status(400).send({ msg: errorList });
    }
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.checkCredentials(email, password);
    if (user) {
      const { accessToken } = await JWTAuthenticate(user);
      res.send(user);
    } else {
      next(createHttpError(401, "Invalid credentials"));
    }
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const user = await UserModel.findById(_id);
    res.send(user);
  } catch (error) {
    next(error);
  }
};

const updateMe = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const me = await UserModel.findByIdAndUpdate(userId, req.body, {
      new: true,
    });

    res.send({ message: "You updated your profile.", me });
  } catch (error) {
    next(error);
  }
};

const deleteMe = async (req, res, next) => {
  try {
    await req.user.deleteOne();
    res.send();
  } catch (error) {
    next(createHttpError(404, `User ${req.params.userId} not found`));
  }
};

const uploadImage = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { image: req.file.path },
      {
        new: true,
      }
    );
    if (updatedUser) {
      res.status(200).send(updatedUser);
    } else {
      next(createHttpError(404, `User ${req.params.userId} not found`));
    }
  } catch (error) {
    next(error);
  }
};

const getUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await UserModel.findById(userId);
    if (user) {
      res.send(user);
    } else {
      next(createHttpError(404, `User ${req.params.userId} not found`));
    }
  } catch (error) {
    next(error);
  }
};

const user = {
  getUsers: getUsers,
  postUser: createUser,
  loginUser: loginUser,
  getMe: getMe,
  putMe: updateMe,
  deleteMe: deleteMe,
  uploadImage: uploadImage,
  getUser: getUser,
};

export default user;
