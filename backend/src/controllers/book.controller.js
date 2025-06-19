import Book from "../models/book.modal.js"; 
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import mongoose from "mongoose";



//@desc    list a new book
//@route   POST /api/v1/books
//@access  admin Only
export const createBook = asyncHandler(async function (req, res) {
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
      throw new ApiError(400, "A book with the same title and author already exists.");
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
      new ApiResponse(201, {
        _id: book._id,
        title: book.title,
        author: book.author,
        price: book.price,
        genre: book.genre,
        stockQuantity: book.stockQuantity,
        createdAt: book.createdAt,
      }, "Book created successfully")
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
    return res.status(200).json(new ApiResponse(200, book, "Book fetched successfully"));
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
  export const getBooks = asyncHandler(async function (req, res){
    const pageSize = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;

    const keyword = req.query.keyword
     ? {
      $or: [
        { title: { $regex: req.query.keyword, $options: "i" } },
        { author: { $regex: req.query.keyword, $options: "i" } },
        {description: { $regex: req.query.keyword, $options: "i" } },
      ],
    }: {};

    const genre = req.query.genre ? { genre: { $in : req.query.genre.split(",").map((genre) => genre.trim()) } } : {};

    const minPrice =  parseFloat(req.query.minPrice);
    const maxPrice =  parseFloat(req.query.maxPrice);

    const priceFilter = {}

    if (!isNaN(minPrice)) priceFilter.price =  { ...priceFliter, $gte: minPrice };
    if (!isNaN(maxPrice)) priceFilter.price =  { ...priceFliter, $lte: maxPrice };

    const publicationYear = parseInt(req.query.publicationYear);
    const publicationYearFilter = publicationYear ? { publicationYear } : {};

    const sort = req.query.sort ? req.query.sort : "createdAt";
   const order = req.query.order === 'desc' ? -1 : 1; 

   const count = await Book.countDocuments({ ...keyword, ...genre, ...priceFilter, ...publicationYearFilter, isActive: true });

    const books = await Book.find({ ...keyword, ...genre, ...priceFilter, ...publicationYearFilter, isActive: true })
      .sort({ [sort]: order })
      .limit(pageSize)
      .skip(pageSize * (page - 1));
return res.status(200).json(new ApiResponse(200, {
  success: true,
  books,
  page,
  pages: Math.ceil(count / pageSize),
  totalBooks: count,
}, "Books fetched successfully"));
});







    