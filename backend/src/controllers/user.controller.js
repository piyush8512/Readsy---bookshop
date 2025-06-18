import { User } from "../models/user.models.js";
import { ApiError } from "../utils/Api.error.js";
import { emailVerificationMailGenContent, sendMail } from "../utils/email.js";
// import bcrypt from "bcrypt";
import crypto from "crypto";

import jwt from "jsonwebtoken";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const registerUser = asyncHandler(async function (req, res) {
  const { username, email, password, role } = req.body;

  try {
    if ([username, email, password].some((field) => field?.trim() === "")) {
      throw new ApiError(400, "All fields are required");
    }

    const existedUser = await User.findOne({
      $or: [
        { username: username.toLowerCase() },
        { email: email.toLowerCase() },
      ],
    });

    if (existedUser) {
      throw new ApiError(400, "User already exists");
    }
    const allowedPublicRoles = ["user"];
    const requestedRole = (role || "user").toLowerCase();
    if (!allowedPublicRoles.includes(requestedRole)) {
      throw new ApiError(400, "Invalid role");
    }
    const user = await User.create({
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password,
      role: requestedRole,
    });
    // const safeUser = await User.findById(user._id).select("-password -refreshToken -emailVerificationToken -emailVerificationTokenExpiry");

    const { hashedToken, tokenExpiry } = user.generateTemporaryToken();
    let verificationURL = `${process.env.Base_URL}/api/v1/users/verify-email/${hashedToken}`;
    let expiryDateFormatted = new Date(tokenExpiry);
    const mailGenContent = emailVerificationMailGenContent(
      user.username,
      verificationURL,
      expiryDateFormatted.toLocaleString()
    );

    await sendMail({
      email: user.email,
      subject: "Email Verification",
      mailGenContent,
    });
    user.emailVerificationToken = hashedToken;
    user.emailVerificationTokenExpiry = tokenExpiry;
    await user.save();

    return res
      .status(201)
      .json(new ApiResponse(201, user, "User created successfully"));
  } catch (error) {
    console.log(error);
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

//login

const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  if (!username && !email) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Username or email is required"));
  }
  if (!password) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Password is required"));
  }
  const user = await User.findOne({ $or: [{ username }, { email }] });
  if (!user) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "User does not exist"));
  }
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    return res
      .status(401)
      .json(new ApiResponse(401, null, "Invalid user credentials"));
  }
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();
  user.refreshToken = refreshToken;

  await user.save({ validateBeforeSave: false });
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
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
});

//logout
const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    { new: true }
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

//send email verification token
const sendEmailVerification = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Email is required"));
  }
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "User does not exist"));
  }
  if (user.isEmailVerified) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Email is already verified"));
  }
  const verificationToken = crypto.randomBytes(32).toString("hex");
  const expiryTime = new Date(Date.now() + 24 * 60 * 60 * 1000);

  user.emailVerificationToken = verificationToken;
  user.emailVerificationTokenExpiry = expiryTime;
  await user.save({ validateBeforeSave: false });
  await sendEmailVerification(user.email, verificationToken);
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Verification email sent successfully"));
});

//verify email
const verifyEmail = asyncHandler(async (req, res) => {
  const { verificationToken } = req.body;
  if (!verificationToken) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Verification token is required"));
  }

  const user = await User.findOne({
    emailVerificationToken: verificationToken,
    emailVerificationTokenExpiry: { $gt: Date.now() },
  });
  if (!user) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Invalid verification token"));
  }
  if (user.isEmailVerified) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Email is already verified"));
  }
  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationTokenExpiry = undefined;
  await user.save({ validateBeforeSave: false });
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Email verified successfully"));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  sendEmailVerification,
  verifyEmail,
};
