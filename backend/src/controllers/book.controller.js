import Book from "../models/book.modal.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import {ApiError} from "../utils/Api.error.js";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

//@desc    list a new book
//@route   POST /api/v1/books
//@access  admin Only
export const addBook = asyncHandler(async function (req, res) {
  try {
    const {
      title,
      author,
      description,
      price,
      coverImageUrl,
      genre,
      image,
      stockQuantity,
      isFeatured,
      isActive,
      publisher,
      publicationYear,
      language,
    } = req.body;

    // Required fields validation
    if (
      !title ||
      !author ||
      !description ||
      !price ||
      !image ||
      !genre ||
      !publicationYear ||
      !stockQuantity
    ) {
      throw new ApiError(
        400,
        "Please fill in all required fields: title, author, description, price, image, genre, publicationYear, stockQuantity."
      );
    }

    // Check if book already exists
    const bookExists = await Book.findOne({ title, author });
    if (bookExists) {
      throw new ApiError(
        400,
        "A book with the same title and author already exists."
      );
    }

    // Create new book
    const book = await Book.create({
      title,
      author,
      description,
      price,
      coverImageUrl,
      genre,
      image,
      stockQuantity,
      isFeatured,
      isActive,
      publisher,
      publicationYear,
      language,
    });

    if (!book) {
      throw new ApiError(400, "Failed to create book.");
    }

    // Success response
    return res.status(201).json(
      new ApiResponse(
        201,
        {
          _id: book._id,
          title: book.title,
          author: book.author,
          price: book.price,
          genre: book.genre,
          stockQuantity: book.stockQuantity,
          createdAt: book.createdAt,
        },
        "Book created successfully"
      )
    );
  } catch (error) {
    // Custom error
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    // Unknown/internal error
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error?.message,
    });
  }
});

//@desc Get book by id
//@route GET /api/v1/books/:id
//@access Public
export const getBookById = asyncHandler(async function (req, res) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throw new ApiError(400, "Invalid book ID format");
    }
    const book = await Book.findById(req.params.id);
    if (!book || !book.isActive) {
      throw new ApiError(404, "Book not found or is not active.");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, book, "Book fetched successfully"));
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        statusCode: error.statusCode,
        message: error.message,
        success: false,
      });
    }
    return res.status(500).json({
      statusCode: 500,
      message: "Something went wrong",
      success: false,
    });
  }
});

//@desc get all books
//@route GET /api/v1/books
//@access Public
export const getBooks = asyncHandler(async function (req, res) {
  const pageSize = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1;

  const keyword = req.query.keyword
    ? {
        $or: [
          { title: { $regex: req.query.keyword, $options: "i" } },
          { author: { $regex: req.query.keyword, $options: "i" } },
          { description: { $regex: req.query.keyword, $options: "i" } },
        ],
      }
    : {};

  const genre = req.query.genre
    ? {
        genre: { $in: req.query.genre.split(",").map((genre) => genre.trim()) },
      }
    : {};

  const minPrice = parseFloat(req.query.minPrice);
  const maxPrice = parseFloat(req.query.maxPrice);

  const priceFilter = {};

  if (!isNaN(minPrice)) priceFilter.price = { ...priceFliter, $gte: minPrice };
  if (!isNaN(maxPrice)) priceFilter.price = { ...priceFliter, $lte: maxPrice };

  const publicationYear = parseInt(req.query.publicationYear);
  const publicationYearFilter = publicationYear ? { publicationYear } : {};

  const sort = req.query.sort ? req.query.sort : "createdAt";
  const order = req.query.order === "desc" ? -1 : 1;

  const count = await Book.countDocuments({
    ...keyword,
    ...genre,
    ...priceFilter,
    ...publicationYearFilter,
    isActive: true,
  });

  const books = await Book.find({
    ...keyword,
    ...genre,
    ...priceFilter,
    ...publicationYearFilter,
    isActive: true,
  })
    .sort({ [sort]: order })
    .limit(pageSize)
    .skip(pageSize * (page - 1));
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        success: true,
        books,
        page,
        pages: Math.ceil(count / pageSize),
        totalBooks: count,
      },
      "Books fetched successfully"
    )
  );
});

//desc update book
//route PUT /api/v1/books/:id
//access admin only
export const updateBook = asyncHandler(async function (req, res) {
  // if (!req.user || !isAdmin(req.user)) {
  //     throw new ApiError(403, "Forbidden: Only admin can update a book.");
  // }

  // Moved these declarations inside the try block as requested
  const { id } = req.params; // Corrected typo: req.
  // prarams -> req.params
  
  const {
    title,
    author,
    genre,
    price,
    description,
    coverImageUrl,
    publisher,
    publicationYear,
    language,
    pageCount,
    stockQuantity,
    isFeatured,
  } = req.body;

  try {
    const book = await Book.findOne({ _id: id });

    if (!book) {
      throw new ApiError(404, "Book not found or is not active.");
    }

    let isUpdated = false;

    if (title && book.title !== title) {
      book.title = title;
      isUpdated = true;
    }

    if (author && book.author !== author) {
      book.author = author;
      isUpdated = true;
    }
    if (
      genre &&
      Array.isArray(genre) &&
      JSON.stringify(book.genre) !== JSON.stringify(genre)
    ) {
      book.genre = genre;
      isUpdated = true;
    }
    if (price !== undefined && book.price !== price) {
      book.price = price;
      isUpdated = true;
    }
    if (publicationYear && book.publicationYear !== publicationYear) {
      book.publicationYear = publicationYear;
      isUpdated = true;
    }
    if (description && book.description !== description) {
      book.description = description;
      isUpdated = true;
    }
    if (stockQuantity !== undefined && book.stockQuantity !== stockQuantity) {
      book.stockQuantity = stockQuantity;
      isUpdated = true;
    }

    if (publisher && book.publisher !== publisher) {
      book.publisher = publisher;
      isUpdated = true;
    }
    if (language && book.language !== language) {
      book.language = language;
      isUpdated = true;
    }
    if (pageCount !== undefined && book.pageCount !== pageCount) {
      book.pageCount = pageCount;
      isUpdated = true;
    }
    if (isFeatured !== undefined && book.isFeatured !== isFeatured) {
      book.isFeatured = isFeatured;
      isUpdated = true;
    }
    if (coverImageUrl && book.coverImageUrl !== coverImageUrl) {
      book.coverImageUrl = coverImageUrl;
      isUpdated = true;
    }

    if (req.file && req.file.path) {
      if (book.image && book.image !== req.file.path) {
        const oldImagePath = path.resolve(__dirname, "..", book.image);
        fs.unlink(oldImagePath, (err) => {
          if (err) {
            console.error(
              `Failed to delete old image file: ${oldImagePath}`,
              err
            );
          } else {
            console.log(`Successfully deleted old image file: ${oldImagePath}`);
          }
        });
      }
      book.image = req.file.path;
      isUpdated = true;
    }

    if (!isUpdated) {
      throw new ApiError(
        400,
        "No valid data provided for book update or no changes detected."
      );
    }

    await book.save();

    return res
      .status(200)
      .json(new ApiResponse(200, book, "Book updated successfully."));
  } catch (error) {
    console.error("Error in updateBook:", error);

    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        statusCode: error.statusCode,
        message: error.message,
        success: false,
      });
    }

    return res.status(500).json({
      statusCode: 500,
      success: false,
      message:
        "Something went wrong while updating the book. Please try again later.",
    });
  }
});


export const deleteBook = asyncHandler(async (req, res) => {
    // if (!req.user || !isAdmin(req.user)) {
    //     throw new ApiError(403, "Forbidden: Only administrators can delete books.");
    // }

    const { id } = req.params;

    const book = await Book.findOne({ _id: id , isActive: true});

    if (!book) {
        throw new ApiError(404, "Book not found or already deleted.");
    }

    book.isActive = false;
    await book.save({ validateBeforeSave: false });

    return res.status(200).json(
        new ApiResponse(200, null, "Book deleted successfully (soft deleted).")
    );
});