import mongoose, { Schema } from 'mongoose';
import { orderItemSchema } from './orderItem.modal.js';

const orderSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Order must belong to a user.'],
        },
        orderItems: [orderItemSchema],

        shippingAddress: {
            address: { type: String, required: [true, 'Shipping address is required.'] },
            city: { type: String, required: [true, 'City is required.'] },
            state: { type: String, required: [true, 'State is required.'] },
            postalCode: { type: String, required: [true, 'Postal code is required.'] },
            country: { type: String, required: [true, 'Country is required.'] },
        },
        paymentMethod: {
            type: String,
            required: [true, 'Payment method is required.'],
            enum: ['Razorpay', 'Credit Card', 'Debit Card', 'Net Banking', 'Cash on Delivery'],
        },
        paymentResult: {
            id: { type: String },      
            status: { type: String },  
            update_time: { type: Date },
            email_address: { type: String }, 
        },
        taxAmount: {
            type: Number,
            required: true,
            default: 0.00,
            min: [0, 'Tax amount cannot be negative.']
        },
        shippingAmount: {
            type: Number,
            required: true,
            default: 0.00,
            min: [0, 'Shipping amount cannot be negative.']
        },
        totalAmount: { // Sum of orderItems prices + tax + shipping
            type: Number,
            required: true,
            default: 0.00,
            min: [0, 'Total amount cannot be negative.']
        },
        orderStatus: {
            type: String,
            required: true,
            enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
            default: 'pending',
        },
        deliveredAt: {
            type: Date,
        },
        paidAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

// --- Middleware to calculate totalAmount before saving ---
orderSchema.pre('save', function(next) {
    if (this.isModified('orderItems') || this.isNew) {
        this.totalAmount = this.orderItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        this.totalAmount += this.taxAmount;
        this.totalAmount += this.shippingAmount;
    }
    next();
});


// // --- Indexes for efficient queries ---
// orderSchema.index({ user: 1 }); // Find orders by a specific user
// orderSchema.index({ orderStatus: 1 }); // Find orders by status
// orderSchema.index({ createdAt: -1 }); // Sort orders by most recent

export const Order = mongoose.model('Order', orderSchema);