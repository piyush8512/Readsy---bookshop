import { body } from "express-validator";
import {ALLOWED_GENRES} from "../utils/constant.js";

export const userRegistrationValidator = () => {
  return [
    body("username")
      .trim()
      .notEmpty()
      .withMessage("Username is Required")
      .isLength({ min: 3 })
      .withMessage("Atleast 3 digits are Required")
      .isLength({ max: 13 })
      .withMessage("Maximum 13 digits Allowed"),
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is Required")
      .isEmail()
      .withMessage("Email is Invalid"),
    body("password")
      .notEmpty()
      .withMessage("Password is Required")
      .isLength({ min: 6 })
      .withMessage("Atleast 6 digits are Required")
      .isLength({ max: 25 })
      .withMessage("Maximum 25 digits Allowed"),
  ];
};

export const userLoginValidator = () => {
  return [
    body("email")
      .trim(),
    body("username")
      .trim(),
    body("password")
      .notEmpty()
      .isLength({ min: 6 })
      .withMessage("Atleast 6 digits are Required")
      .isLength({ max: 25 })
      .withMessage("Maximum 25 digits Allowed"),
  ];
};

export const userChangePasswordValidator = () => {
  return [
    body("email")
      .trim(),
    body("username")
      .trim(),
    body("oldPassword")
      .trim()
      .notEmpty()
      .withMessage("Old Password is required"),
    body("newPassword")
      .notEmpty()
      .withMessage("New Password is Required")
      .isLength({ min: 6 })
      .withMessage("Atleast 6 digits are Required")
      .isLength({ max: 25 })
      .withMessage("Maximum 25 digits Allowed"),
  ]
}

export const resendVerificationEmailValidator = () => {
  return [
    body("email")
      .trim(),
    body("username")
      .trim(),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password is Required")
]}

export const forgotPasswordRequestValidator = () => {
  return [
    body("email")
      .trim(),
    body("username")
      .trim(),
  ]
}

export const resetPasswordValidator = () => {
  return [
    body("newPassword")
    .trim()
    .notEmpty()
    .withMessage("Password is Required")
  ]
}




export const bookValidationSchema = () => {
  const currentYear = new Date().getFullYear();
  return [
    body('title')
      .trim()
      .notEmpty()
      .withMessage('Title is required.')
      .isLength({ min: 3 })
      .withMessage('Title must be at least 3 characters long.')
      .isLength({ max: 255 })
      .withMessage('Title cannot exceed 255 characters.'),

    // Author Validation
    body('author')
      .trim()
      .notEmpty()
      .withMessage('Author is required.')
      .isLength({ min: 3 })
      .withMessage('Author name must be at least 3 characters long.')
      .isLength({ max: 100 })
      .withMessage('Author name cannot exceed 100 characters.'),

    // Description Validation
    body('description')
      .trim()
      .notEmpty()
      .withMessage('Description is required.')
      .isLength({ min: 3 })
      .withMessage('Description must be at least 3 characters long.')
      .isLength({ max: 2000 }) 
      .withMessage('Description cannot exceed 2000 characters.'),

    // Price Validation
    body('price')
      .notEmpty()
      .withMessage('Price is required.')
      .isFloat({ min: 0 })
      .withMessage('Price must be a non-negative number.'),

    // Cover Image URL Validation
    body('coverImageUrl')
      .optional({ checkFalsy: true }) 
      .trim()
      .isURL()
      .withMessage('Please enter a valid URL for the cover image.')
      .matches(/^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|bmp|webp|svg))$/)
      .withMessage('Cover image URL must end with a valid image extension (png, jpg, jpeg, gif, bmp, webp, svg).'),

    // Main Image URL Validation (Required)
    body('image')
      .notEmpty()
      .withMessage('Image URL is required.')
      .trim()
      .isURL()
      .withMessage('Please enter a valid URL for the main image.')
      .matches(/^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|bmp|webp|svg))$/)
      .withMessage('Main image URL must end with a valid image extension (png, jpg, jpeg, gif, bmp, webp, svg).'),

    // Genre Validation
    body('genre')
      .notEmpty()
      .withMessage('At least one genre is required.')
      .isArray()
      .withMessage('Genre must be an array.')
      .custom((value, { req }) => {
        if (!Array.isArray(value) || value.length === 0) {
          throw new Error('At least one genre is required.');
        }
        for (const g of value) {
          if (typeof g !== 'string' || !ALLOWED_GENRES.includes(g)) {
            throw new Error(`Genre "${g}" is not a valid genre.`);
          }
        }
        return true;
      }),

    // Publisher Validation (Optional)
    body('publisher')
      .optional({ checkFalsy: true })
      .trim()
      .isLength({ max: 100 }) 
      .withMessage('Publisher name cannot exceed 100 characters.'),

    // Publication Year Validation
    body('publicationYear')
      .notEmpty()
      .withMessage('Publication year is required.')
      .isInt({ min: 1000, max: currentYear + 5 })
      .withMessage(`Publication year must be a valid year between 1000 and ${currentYear + 5}.`),
      
    body('averageRating')
      .optional({ checkFalsy: true })
      .isFloat({ min: 0, max: 5 })
      .withMessage('Average rating must be a number between 0 and 5.'),

    body('numberOfRatings')
      .optional({ checkFalsy: true })
      .isInt({ min: 0 })
      .withMessage('Number of ratings must be a non-negative integer.'),

    // Language Validation 
    body('language')
      .optional({ checkFalsy: true })
      .trim()
      .isLength({ max: 50 })
      .withMessage('Language cannot exceed 50 characters.'),

    // Stock Quantity Validation
    body('stockQuantity')
      .notEmpty()
      .withMessage('Stock quantity is required.')
      .isInt({ min: 0 }) // Matches schema's min: 0
      .withMessage('Stock quantity must be a non-negative integer.'),

    // Is Featured Validation (Optional)
    body('isFeatured')
      .optional({ checkFalsy: true })
      .isBoolean()
      .withMessage('Is Featured must be a boolean value.'),

    // Is Active Validation (Optional)
    body('isActive')
      .optional({ checkFalsy: true })
      .isBoolean()
      .withMessage('Is Active must be a boolean value.'),
  ];
};