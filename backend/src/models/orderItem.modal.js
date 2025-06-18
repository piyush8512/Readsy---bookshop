import mongoose, { Schema } from 'mongoose';
const orderItemSchema = new Schema(
    {
        book: {
            type: Schema.Types.ObjectId,
            ref: 'Book',
            required: true,
        },
        quantity: { 
            type: Number,
            required: [true, 'Quantity is required for an order item.'],
            min: [1, 'Quantity must be at least 1.'],
        },
        price: { 
            type: Number,
            required: [true, 'Price at the time of order is required.'],
            min: [0, 'Price cannot be negative.'],
        },
        title: { 
            type: String, 
            required: true },

        author: { 
            type: String, 
            required: true 
        },

        coverImageUrl: { 
            type: String 
        }, 
    },
    { _id: false }
);

export default orderItemSchema;