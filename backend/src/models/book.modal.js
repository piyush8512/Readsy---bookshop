import mongoose from "mongoose";


const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title is required"], 
        minlength: [3, "Title must be at least 3 characters long"],
        trim: true,
    },
    author: {
        type: String,
        required: [true, "Author is required"],
        trim: true,
        minlength: [3, "Author must be at least 3 characters long"],

    },
    description: {
        type: String,
        required:[true, "Description is required"] ,
        trim: true,
        minlength: [3, "Description must be at least 3 characters long"],
    },
    price: {
        type: Number,
        required: [true, "Price is required"], 
        min : [0, "price must be greater than 0"],
    },
    coverImageUrl: {
    type: String,
    trim: true,
    match: [/^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|bmp|webp|svg))$/, 'Please enter a valid URL for the cover image.']
  },
    image: {
        type: String,
        required: true,
    },
  genre: {
    type: [String], // Array of strings for multiple genres
    required: [true, 'At least one genre is required.'],
    enum: [
      'Fiction', 'Non-Fiction', 'Science Fiction', 'Fantasy', 'Mystery',
      'Thriller', 'Romance', 'Horror', 'Biography', 'History',
      'Self-Help', 'Childrens', 'Young Adult', 'Poetry', 'Travel',
      'Cooking', 'Art', 'Business', 'Technology', 'Science',
      'Health', 'Education', 'Religion', 'Spirituality', 'Comics',
      'Graphic Novels', 'Manga', 'True Crime', 'Classics', 'Contemporary'
    ],
    default: [],
  },

  publisher: {
    type: String,
    trim: true,
    default: 'Self-Published'
  },
  publicationYear: {
    type: Number,
    required: [true, 'Publication year is required.'],
    min: [1000, 'Invalid publication year.'],
    max: [new Date().getFullYear() + 5, 'Publication year cannot be in the distant future.'] 
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
    set: val => Math.round(val * 10) / 10 
  },
  numberOfRatings: {
    type: Number,
    default: 0,
    min: 0
  },
  language: {
    type: String,
    trim: true,
    default: 'English'
  },
//   pageCount: {
//     type: Number,
//     min: [1, 'Page count must be at least 1.']
//   },

  

    stockQuantity: {
    type: Number,
    required: [true, 'Stock quantity is required.'],
    min: [0, 'Stock quantity cannot be negative.'],
    default: 0
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }},{
    timestamps: true }

    );



// bookSchema.index({ title: 1, author: 1 });
// bookSchema.index({ genre: 1 });
// bookSchema.index({ price: 1 });


bookSchema.pre("save", function (next) { 
    this.updatedAt = Date.now();
    next();
});

export default mongoose.model("Book", bookSchema);        