import mongoose from "mongoose";
import bcrypt from "bcrypt";

const { Schema, model } = mongoose;

const UserSchema = new Schema(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    image: { type: String },
    accessToken: { type: String },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", async function (next) {
  const newUser = this;
  const plainPassword = newUser.password;
  if (newUser.isModified("password")) {
    newUser.password = await bcrypt.hash(plainPassword, 10);
  }
  next();
});

UserSchema.methods.toJSON = function () {
  const userDocument = this;
  const userObject = userDocument.toObject();
  delete userObject.password;
  delete userObject.__v;
  return userObject;
};

UserSchema.statics.checkCredentials = async function (email, plainPassword) {
  const user = await this.findOne({ email });
  console.log(user);
  if (user) {
    const isMatch = await bcrypt.compare(plainPassword, user.password);
    if (isMatch) return user;
    else return null;
  } else {
    return null;
  }
};

export default model("user", UserSchema);
