import ItemModel from "../../db/models/item.js";
import createHttpError from "http-errors";
import q2m from "query-to-mongo";
import { validationResult } from "express-validator";

const getItems = async (req, res, next) => {
  try {
    const query = q2m(req.query);
    const total = await ItemModel.countDocuments(query.criteria);
    const items = await ItemModel.find(query.criteria, query.options.fields)
      .limit(query.options.limit)
      .skip(query.options.skip)
      .sort(query.options.sort);

    res.send({
      links: query.links("/items", total),
      total,
      items,
      pageTotal: Math.ceil(total / query.options.limit),
    });
  } catch (error) {
    next(error);
  }
};

const createItem = async (req, res, next) => {
  try {
    const errorList = validationResult(req);
    if (!errorList.isEmpty()) {
      next(createHttpError(400, errorList));
    }
    const newItem = new ItemModel(req.body);
    const item = await newItem.save();

    res.status(201).send(item);
  } catch (error) {
    next(error);
  }
};

const getItem = async (req, res, next) => {
  try {
    const item = await ItemModel.findById(req.params.itemId);
    res.send(item);
  } catch (error) {
    next(createHttpError(404, `Item ${req.params.itemId} not found`));
  }
};

const updateItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const updatedItem = await ItemModel.findByIdAndUpdate(itemId, req.body, {
      new: true,
    });
    if (updatedItem) {
      res.send(updatedItem);
    } else {
      next(createHttpError(404, `Item ${itemId} not found`));
    }
  } catch (error) {
    next(error);
  }
};

const deleteItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    await ItemModel.findByIdAndDelete(itemId);
    res.sendStatus(204);
  } catch (error) {
    next(createHttpError(404, `Item ${req.params.itemId} not found`));
  }
};

const postImage = async (req, res, next) => {
  try {
    const addImage = await ItemModel.findByIdAndUpdate(
      req.params.itemId,
      { image: req.file.path },
      { new: true }
    );
    if (addImage) {
      res.status(200).send(addImage);
    } else {
      res.status(404).send(`${req.params.itemId} NOT found!!`);
    }
  } catch (error) {
    next(error);
  }
};

const getComments = async (req, res, next) => {
  try {
    const item = await ItemModel.findById(req.params.itemId);

    if (item) {
      res.send(item.comments);
    } else {
      next(createError(404, `Item with id ${req.params.itemId} not found!`));
    }
  } catch (error) {
    next(error);
  }
};

const postComment = async (req, res, next) => {
  try {
    const item = await ItemModel.findById(req.params.itemId);

    if (item) {
      const newComment = await ItemModel.findByIdAndUpdate(
        req.params.itemId,
        {
          $push: {
            comments: {
              comment: req.body.comment,
              user: req.body.user,
              first_name: req.body.first_name,
            },
          },
        },
        { new: true }
      );
      const allComments = newComment.comments;
      const commentsLength = allComments.length;
      res.send(allComments[commentsLength - 1]);
    }
  } catch (error) {
    next(error);
  }
};

const updateComment = async (req, res, next) => {
  try {
    const comment = await ItemModel.findOneAndUpdate(
      { _id: req.params.itemId, "comments._id": req.params.commentId },

      {
        $set: {
          "comments.$": req.body,
        },
      },
      { new: true }
    );

    if (comment) {
      res.send(comment);
    }
  } catch (error) {
    next(createHttpError(404));
  }
};

const deleteComment = async (req, res, next) => {
  try {
    const comment = await ItemModel.findByIdAndUpdate(
      req.params.itemId,
      {
        $pull: {
          comments: { _id: req.params.commentId },
        },
      },
      { new: true }
    );
    res.send(
      `${req.params.commentId} comment at item ${req.params.itemId} is deleted!`
    );
  } catch (error) {
    next(createHttpError(404));
  }
};

const item = {
  getItems: getItems,
  postItem: createItem,
  getItem: getItem,
  putItem: updateItem,
  deleteItem: deleteItem,
  postImage: postImage,
  getComments: getComments,
  postComment: postComment,
  putComment: updateComment,
  deleteComment: deleteComment,
};

export default item;
