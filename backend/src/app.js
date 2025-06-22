import express from "express";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.routes.js";
import bookroutes from "./routes/book.route.js";
import orderRoutes from "./routes/order.route.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use("/api/v1/users", userRoutes);
app.use("/api/v1/books", bookroutes);
app.use("/api/v1/order", orderRoutes);


export default app;





