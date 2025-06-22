import Book from "../models/book.modal.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import {ApiError} from "../utils/Api.error.js";
import mongoose from "mongoose";
import {Order} from "../models/order.modal.js";

export const createOrder = asyncHandler(async function (req, res) {
    try{
        if (!req.user){
            throw new ApiError(401, "Unauthorized: User not authenticated.");
        }
        const {orderItems, shippingAddress, paymentMethod,taxAmount, shippingAmount, totalAmount} = req.body;
        if (!orderItems || orderItems.length === 0) {
        throw new ApiError(400, "No order items provided.");
    }
    if (!shippingAddress || !paymentMethod  || shippingAmount === undefined || totalAmount === undefined) {
        throw new ApiError(400, "Missing required order details (shippingAddress, paymentMethod, prices).");
    }
    if (!shippingAddress.city || !shippingAddress.state || !shippingAddress.postalCode || !shippingAddress.country) {
        throw new ApiError(400, "Missing required shipping address fields.");
    }
    const processedOrderItems = [];
    let itemsPrice = 0;

    for (const item of orderItems) {
        if (!item.book || !item.quantity || item.quantity < 1) {
            throw new ApiError(400, "Each order item must have a valid book ID and a quantity of at least 1.");
        }

        if (!mongoose.Types.ObjectId.isValid(item.book)) {
            throw new ApiError(400, `Invalid book ID format for item: ${item.book}`);
        }

        const bookFromDB = await Book.findById(item.book).select('title author price image stockQuantity isActive');

        if (!bookFromDB || !bookFromDB.isActive) {
            throw new ApiError(404, `Book not found or is inactive: ${item.book}`);
        }

        if (bookFromDB.stockQuantity < item.quantity) {
            throw new ApiError(400, `Insufficient stock for book "${bookFromDB.title}". Available: ${bookFromDB.stockQuantity}, Requested: ${item.quantity}`);
        }

        processedOrderItems.push({
            book: bookFromDB._id,
            title: bookFromDB.title,
            author: bookFromDB.author,
            image: bookFromDB.image,
            price: bookFromDB.price,
            quantity: item.quantity
        });

        itemsPrice += bookFromDB.price * item.quantity;
        bookFromDB.stockQuantity -= item.quantity;
        await bookFromDB.save({ validateBeforeSave: false });
    }
    const order = new Order({
        user: req.user._id,
        orderItems: processedOrderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice: itemsPrice, 
        taxAmount,
        shippingAmount,
        totalAmount,
    });

    const createdOrder = await order.save();

    res.status(201).json(new ApiResponse(201, createdOrder, "Order created successfully."));
    }catch (error) {
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
})

export const getOrderById = asyncHandler(async (req, res) => {
    if (!req.user) {
        throw new ApiError(401, "Unauthorized: User not authenticated.");
    }
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid order ID format.");
    }
    const order = await Order.findById(id).populate('user','username email role').populate('orderItems.book', 'title author coverImageUrl');

    if (!order) {
        throw new ApiError(404, "Order not found.");
    }
    if (order.user._id.toString() !== req.user._id.toString() && !isAdmin(req.user)) {
        throw new ApiError(403, "Forbidden: Not authorized to view this order.");
    }
    return res.status(200).json(
        new ApiResponse(200, order, "Order fetched successfully.")
    );
});

// @desc    Get all orders for the authenticated user
// @route   GET /api/orders/my
// @access  Authenticated User
export const getMyOrders = asyncHandler(async (req, res) => {
    if (!req.user) {
        throw new ApiError(401, "Unauthorized: User not authenticated.");
    }

    const pageSize = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const skip = pageSize * (page - 1);

    const query = { user: req.user._id };

    const count = await Order.countDocuments(query); 
    const orders = await Order.find(query)
                                .sort({ createdAt: -1 })
                                .limit(pageSize)
                                .skip(skip)
                                .populate('orderItems.book', 'title author coverImageUrl'); 

    return res.status(200).json(
        new ApiResponse(200, {
            orders,
            page,
            pages: Math.ceil(count / pageSize),
            totalOrders: count,
        }, "User orders fetched successfully.")
    );
});

// @desc    Update order to paid (e.g., from a payment gateway webhook)
// @route   PUT /api/orders/:id/pay
// @access  Admin or Webhook (depends on your setup, often no direct user access)
export const updateOrderToPaid = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { transactionId, status, update_time, email_address } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid order ID format.");
    }

    const order = await Order.findById(id);

    if (!order) {
        throw new ApiError(404, "Order not found.");
    }

    if (order.isPaid) {
        throw new ApiError(400, "Order is already marked as paid.");
    }
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
        transactionId,
        status,
        update_time,
        email_address,
    };
    order.orderStatus = 'processing'; 

    const updatedOrder = await order.save();

    return res.status(200).json(
        new ApiResponse(200, updatedOrder, "Order marked as paid successfully.")
    );
});


// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Admin Only
export const updateOrderToDelivered = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid order ID format.");
    }
    const order = await Order.findById(id);
    if (!order) {
        throw new ApiError(404, "Order not found.");
    }
    if (order.isDelivered) {
        throw new ApiError(400, "Order is already marked as delivered.");
    }
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    order.orderStatus = 'delivered';


    const updatedOrder = await order.save();

    return res.status(200).json(
        new ApiResponse(200, updatedOrder, "Order marked as delivered successfully.")
    );
});


// @desc    Get all orders (for admin dashboard)
// @route   GET /api/orders/admin/all
// @access  Admin Only
export const getAllOrders = asyncHandler(async function (req, res) {


    const pageSize = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const skip = pageSize * (page - 1);

    const query = {}; 

    if (req.query.status) {
        query.orderStatus = req.query.status;
    }
    if (req.query.userId && mongoose.Types.ObjectId.isValid(req.query.userId)) {
        query.user = req.query.userId;
    }

    const count = await Order.countDocuments(query);
    const orders = await Order.find(query).sort({ createdAt: -1 }).limit(pageSize).skip(skip).populate('user', 'username email').populate('orderItems.book', 'title author coverImageUrl');

    return res.status(200).json(
        new ApiResponse(200, {
            orders,
            page,
            pages: Math.ceil(count / pageSize),
            totalOrders: count,
        }, "All orders fetched successfully for admin.")
    );
});

