import express from "express";
import { isLoggedIn } from "../middleware/auth.middleware.js";
import { authorizeAdmin } from "../middleware/isAdmin.middleware.js";
import { validate } from '../middleware/validator.middleware.js';
import { bookValidationSchema } from "../validators/index.js";
import {
  addBook,
  deleteBook,
  getBookById,
  getBooks,
  updateBook
} from "../controllers/book.controller.js";

const router = express.Router();

router.post("/", isLoggedIn, authorizeAdmin, bookValidationSchema(),validate, addBook);
router.put("/:id", isLoggedIn, authorizeAdmin, bookValidationSchema(), validate,updateBook);
router.get("/", getBooks);
router.get("/:id", getBookById);
router.delete("/:id", isLoggedIn, authorizeAdmin, deleteBook);

export default router;
