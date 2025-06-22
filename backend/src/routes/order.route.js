import express from "express";
import { isLoggedIn } from "../middleware/auth.middleware.js";
import {
  createOrder,
  getOrderById,
  getMyOrders,
  updateOrderToPaid,
  updateOrderToDelivered,
  getAllOrders
} from "../controllers/order.controller.js";
import { validate } from "../middleware/validator.middleware.js";
import { orderValidationSchema } from "../validators/index.js";
import { authorizeAdmin } from "../middleware/isAdmin.middleware.js";


const router = express.Router();
router.post(
  "/",
  isLoggedIn,
  orderValidationSchema.createOrder(),
  validate,
  createOrder
);

router.get("/my", isLoggedIn, getMyOrders);

router.put(
  "/:id/pay",
  isLoggedIn,
  authorizeAdmin,
  orderValidationSchema.updateOrderToPaid(),
  validate,
  updateOrderToPaid
);

router.put(
  "/:id/deliver",
  isLoggedIn,
  authorizeAdmin,
  orderValidationSchema.updateOrderStatus(),
  validate,
  updateOrderToDelivered
);

router.get("/admin/all", isLoggedIn, authorizeAdmin, getAllOrders);

router.get("/:id", isLoggedIn, getOrderById);

export default router;
