import mongoose, { Schema } from 'mongoose';

const reviewSchema = new Schema(
    {
        book: {
            type: Schema.Types.ObjectId,
            ref: 'Book',
            required: [true, 'Review must belong to a book.'],
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Review must belong to a user.'],
        },
        rating: {
            type: Number,
            required: [true, 'A rating is required.'],
            min: [1, 'Rating must be at least 1.0'],
            max: [5, 'Rating cannot be more than 5.0'],
            set: val => Math.round(val * 10) / 10,
        },
        comment: {
            type: String,
            trim: true,
            maxlength: [500, 'Review comment cannot exceed 500 characters.'], 
            minlength: [10, 'Review comment must be at least 10 characters long.'] 
        },
    },
    {
        timestamps: true,
        // toJSON: { virtuals: true }, // Include virtuals when converting to JSON
        // toObject: { virtuals: true } // Include virtuals when converting to Object
    }
);

reviewSchema.index({ book: 1, user: 1 }, { unique: true });

// // Index for finding reviews by a specific book (common operation)
// reviewSchema.index({ book: 1 });

// // Index for finding reviews by a specific user
// reviewSchema.index({ user: 1 });

// // Index for finding reviews by rating (e.g., for filtering or sorting)
// reviewSchema.index({ rating: -1 }); // -1 for descending order (higher ratings first)

// --- Post-save hook to update book's average rating and number of ratings ---
reviewSchema.statics.calculateAverageRatings = async function(bookId) {
    const stats = await this.aggregate([
        { 
            $match: { book: bookId }
        },
        {
            $group: {
                _id: '$book',
                nRating: { $sum: 1 },
                avgRating: { $avg: '$rating' }  
            }
        }
    ]);

    // // Import the Book model dynamically to avoid circular dependency issues
    // const Book = mongoose.model('Book'); 

    // if (stats.length > 0) {
    //     // Update the book's averageRating and numberOfRatings
    //     await Book.findByIdAndUpdate(bookId, {
    //         averageRating: stats[0].avgRating,
    //         numberOfRatings: stats[0].nRating
    //     });
    // } else {
    //     // If all reviews are deleted, reset average rating and count to 0
    //     await Book.findByIdAndUpdate(bookId, {
    //         averageRating: 0,
    //         numberOfRatings: 0
    //     });
    // }
};

// Call calculateAverageRatings after a review is saved
reviewSchema.post('save', function() {
    // 'this' points to current review
    this.constructor.calculateAverageRatings(this.book);
});

// Call calculateAverageRatings after a review is deleted (or updated, if rating changes)
// For `findOneAndDelete` and `findByIdAndDelete` middleware, you need to use `pre` hook
// to get access to the document before it's removed, then trigger post delete calculation
// reviewSchema.post(/^findOneAnd/, async function(doc) {
//     if (doc) { 
//         await doc.constructor.calculateAverageRatings(doc.book);
//     }
// });

 
export const Review = mongoose.model('Review', reviewSchema);