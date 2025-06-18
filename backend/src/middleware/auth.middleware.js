// import jwt from "jsonwebtoken";

// import { User } from "../models/user.models.js";
// import asyncHandler from "../utils/asyncHandler.js";

// const verifyJWT = asyncHandler(async (req, res, next) => {
//   const token = req.cookies?.accessToken;

//   if (!token) {
//     return res.status(401).json({ message: "Unauthorized, no token" });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
//     req.user = await User.findById(decoded._id).select("-password -refreshToken");
//     next();
//   } catch (error) {
//     return res.status(401).json({ message: "Invalid or expired token" });
//   }
// });

// export default verifyJWT;


import jwt from "jsonwebtoken";


export const isLoggedIn = (req,res,next) => {
    // send next() only if valid access token

    const token = req.cookies.accessToken;
    // console.log(token);
    if (token) {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    status: 401,
                    message: "Invalid Token",
                    error: err,
                    success: false
                });
            }
            req.user = decoded;
            next();
        });
    } else {
        return res.status(401).json({
            status: 401,
            message: "User not logged in",
            success: false
        });
    }
}