import { body } from "express-validator";

export const signupValidationMiddleware = [
  body("first_name").exists().withMessage("First name is required"),
  body("last_name").exists().withMessage("Last name is required"),
  body("email").isEmail().withMessage("Email is not valid"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

export const loginValidationMiddleware = [
  body("email").exists().withMessage("Please enter correct email"),
  body("password").exists().withMessage("Please enter correct password"),
];

export const itemsValidationMiddleware = [
  body("item_name").exists().withMessage("Item name is required"),
  body("price").exists().withMessage("Item price is required"),
  body("category").exists().withMessage("Item description is required"),
  body("description").exists().withMessage("Item description is required"),
];
