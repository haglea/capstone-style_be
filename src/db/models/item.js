import mongoose from "mongoose";

const { Schema, model } = mongoose;

const ItemSchema = new Schema(
  {
    item_name: { type: String, required: true },
    image: { type: String },
    price: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    comments: [
      {
        comment: { type: String },
        user: { type: Schema.Types.ObjectId, ref: "User" },
        first_name: { type: String },
        createdAt: { type: Date, required: true, default: Date.now },
        updatedAt: { type: Date, required: true, default: Date.now },
      },
    ],
    user: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
  },
  {
    timestamps: true,
  }
);

export default model("item", ItemSchema);
