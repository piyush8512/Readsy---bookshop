import { body, param } from "express-validator";
import {ALLOWED_GENRES} from "../utils/constant.js";
import mongoose from "mongoose";

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

export const orderValidationSchema = {
  createOrder: () => {
    return [
      body('orderItems')
        .isArray({ min: 1 })
        .withMessage('Order items must be a non-empty array.')
        .custom((value, { req }) => {
          for (let i = 0; i < value.length; i++) {
            const item = value[i];

            if (!item.book || !mongoose.Types.ObjectId.isValid(item.book)) {
              throw new Error(`Order item ${i}: Invalid or missing book ID.`);
            }
            if (item.quantity === undefined || typeof item.quantity !== 'number' || item.quantity < 1 || !Number.isInteger(item.quantity)) {
              throw new Error(`Order item ${i}: Quantity must be an integer number greater than or equal to 1.`);
            }
            if (item.price === undefined || typeof item.price !== 'number' || item.price < 0) {
              throw new Error(`Order item ${i}: Price must be a number greater than or equal to 0.`);
            }
            if (!item.title || typeof item.title !== 'string' || item.title.trim() === '') {
                throw new Error(`Order item ${i}: Title is required for an order item.`);
            }
            if (!item.author || typeof item.author !== 'string' || item.author.trim() === '') {
                throw new Error(`Order item ${i}: Author is required for an order item.`);
            }
            if (!item.image || typeof item.image !== 'string' || item.image.trim() === '') {
                throw new Error(`Order item ${i}: Image is required for an order item.`);
            }
          }
          return true;
        }),

      body('shippingAddress')
        .isObject()
        .withMessage('Shipping address must be an object.')
        .notEmpty()
        .withMessage('Shipping address cannot be empty.'),
      body('shippingAddress.address')
        .isString()
        .withMessage('Shipping address (address) must be a string.')
        .notEmpty()
        .withMessage('Shipping address (address) is required.'),
      body('shippingAddress.city')
        .isString()
        .withMessage('Shipping address (city) must be a string.')
        .notEmpty()
        .withMessage('Shipping address (city) is required.'),
      body('shippingAddress.state')
        .isString()
        .withMessage('Shipping address (state) must be a string.')
        .notEmpty()
        .withMessage('Shipping address (state) is required.'),
      body('shippingAddress.postalCode')
        .isString()
        .withMessage('Shipping address (postal code) must be a string.')
        .notEmpty()
        .withMessage('Shipping address (postal code) is required.'),
      body('shippingAddress.country')
        .isString()
        .withMessage('Shipping address (country) must be a string.')
        .notEmpty()
        .withMessage('Shipping address (country) is required.'),

      body('paymentMethod')
        .isString()
        .withMessage('Payment method must be a string.')
        .notEmpty()
        .withMessage('Payment method is required.')
        .isIn(['Razorpay', 'Credit Card', 'Debit Card', 'Net Banking', 'Cash on Delivery'])
        .withMessage('Invalid payment method. Allowed values are: Razorpay, Credit Card, Debit Card, Net Banking, Cash on Delivery.'),

      body('taxAmount')
        .isFloat({ min: 0 })
        .withMessage('Tax amount must be a non-negative number.'),

      body('shippingAmount')
        .isFloat({ min: 0 })
        .withMessage('Shipping amount must be a non-negative number.'),

      body('totalAmount')
        .isFloat({ min: 0 })
        .withMessage('Total amount must be a non-negative number.')
        .notEmpty()
        .withMessage('Total amount is required.'),
    ];
  },
  
  updateOrderToPaid: () => {
    return [
      param('id') 
        .notEmpty()
        .withMessage('Order ID is required.')
        .custom((value) => mongoose.Types.ObjectId.isValid(value))
        .withMessage('Invalid order ID format.'),
      body('transactionId') // This is the 'id' field from your payment gateway's response body
        .isString()
        .withMessage('Payment transaction ID must be a string.')
        .notEmpty()
        .withMessage('Payment transaction ID is required.'),
      body('status')
        .isString()
        .withMessage('Payment status must be a string.')
        .notEmpty()
        .withMessage('Payment status is required.'),
      body('update_time')
        .isString()
        .withMessage('Payment update time must be a string.')
        .notEmpty()
        .withMessage('Payment update time is required.')
        .isISO8601()
        .withMessage('Payment update time must be a valid ISO 8601 date string.'),
      body('email_address')
        .isEmail()
        .withMessage('Payer email address must be a valid email.')
        .notEmpty()
        .withMessage('Payer email address is required.'),
    ];
  },

  updateOrderStatus: () => {
    return [
      param('id') // For req.params.id
        .notEmpty() 
        .withMessage('Order ID is required.')
        .custom((value) => mongoose.Types.ObjectId.isValid(value))
        .withMessage('Invalid order ID format.'),
      body('orderStatus')
        .isString()
        .withMessage('Order status must be a string.')
        .notEmpty()
        .withMessage('Order status is required.')
        .toLowerCase()
        .isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'])
        .withMessage('Invalid order status. Allowed values are: pending, processing, shipped, delivered, cancelled, refunded.'),
    ];
  }
};





