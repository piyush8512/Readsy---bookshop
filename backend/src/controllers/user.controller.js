// import {User, user} from "../models/user.models.js";

import{User } from "../models/user.models.js";
// import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";



const registerUser = asyncHandler(async (req, res) => {
    const {username, email, password} = req.body;
    if ([username,email,password].some(field => field?.trim() === "")) {
        return res.status(400).json(new ApiResponse(400, null, "All fields are required"));
    }
    const existedUser = await User.findOne({
        $or: [{username}, {email}],
    });
    if (existedUser) {
        return res.status(409).json(new ApiResponse(409, null, "User already exists"));
    }
    const user = await User.create({
        username: username.toLowerCase(),
        email: email.toLowerCase(),
        password,
    });

    const createdUser = await User.findById(user._id).select("-password -refreshToken");
    if (!createdUser){
        return res.status(500).json(new ApiResponse(500, null, "Error creating user"));
    }

     return res.status(201).json(new ApiResponse(201, createdUser, "User registered successfully"));
    });



    //login

const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

        if (!username && !email) {
        return res.status(400).json(new ApiResponse(400, null, "Username or email is required"));
    }
     if (!password) {
        return res.status(400).json(new ApiResponse(400, null, "Password is required"));
    }
    const user = await User.findOne({ $or: [{ username }, { email }] });
    if (!user) {
        return res.status(404).json(new ApiResponse(404, null, "User does not exist"));
    }
    const isPasswordValid = await user.isPasswordCorrect(password);
     if (!isPasswordValid) {
        return res.status(401).json(new ApiResponse(401, null, "Invalid user credentials"));
    }
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    
    await user.save({ validateBeforeSave: false });
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

       const options = {
        httpOnly: true, // Only accessible by web server
        secure: process.env.NODE_ENV === 'production', // Send only on HTTPS in production
        sameSite: 'strict', // Protects against CSRF
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    };
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken,
                },
                "User logged In successfully"
            )
        );


    })


    //logout
    const logoutUser = asyncHandler(async (req, res) => {
     await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined, // Clear the refresh token
      },
    },
    { new: true } // Return the updated document
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});



export {registerUser, loginUser, logoutUser};