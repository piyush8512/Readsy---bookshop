import { User } from "../models/user.models.js";
import { ApiError } from "../utils/Api.error.js";
import { emailVerificationMailGenContent, sendMail } from "../utils/mail.js";
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

//verify mail
export const verifyMail = asyncHandler(async function (req, res) {
  const { token } = req.params;

  try {
    const user = await User.findOne({
      emailVerificationToken: token,
    });
    if (!user) {
      throw new ApiError(400, "Invalid verification token");
    }

    if (Date.now() > user.emailVerificationTokenExpiry) {
      throw new ApiError(400, "Verification token expired");
    }
    user.emailVerificationToken = undefined;
    user.emailVerificationTokenExpiry = undefined;
    user.isEmailVerified = true;
    await user.save({ validateBeforeSave: false });
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          {
            id: user._id,
            username: user.username,
            isVerified: user.isEmailVerified,
          },
          "Email verified successfully"
        )
      );
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
      message: "Something went wrong while verifying user ",
      success: false,
    });
  }
});

//login
export const loginUser = asyncHandler(async function (req, res) {
  const { email, username, password } = req.body;

  try {
    if (!username && !email) {
      throw new ApiError(400, "Username or email is required");
    }
    if (!password) {
      throw new ApiError(400, "Password is required");
    }
    const user = await User.findOne({
      $or: [
        { username: username?.toLowerCase() },
        { email: email?.toLowerCase() },
      ],
    });
    if (!user) {
      throw new ApiError(404, "User does not exist");
    }
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid user credentials");
    }
    if (!user.isEmailVerified) {
      throw new ApiError(401, "Verify your Email before login");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };
    res.cookie("accessToken", accessToken, options);
    res.cookie("refreshToken", refreshToken, options);
    user.refreshToken = refreshToken;
    await user.save();
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { id: user._id, username: user.username, email: user.email },
          "User logged In successfully"
        )
      );
  } catch (error) {
    console.log("Login error", error);
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        statusCode: error.statusCode,
        message: error.message,
        success: false,
      });
    }

    return res.status(500).json({
      statusCode: 500,
      success: false,
      message: "Something went wrong while logging the User",
    });
  }
});

//change current password
export const changePassword = asyncHandler(async function (req, res) {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user?._id;

  try {
    if (!userId) {
      throw new ApiError(401, "User is not authenticated.");
    }

    if (!oldPassword || !newPassword) {
      throw new ApiError(400, "Both old password and new password are required.");
    }
    if (oldPassword === newPassword) {
      throw new ApiError(400, "New password cannot be the same as the old password.");
    }
    if (newPassword.length < 8) {
      throw new ApiError(
        400,
        "New password must be at least 8 characters long."
      );
    }

    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, "Authenticated user not found in database.");
    }

    const isPasswordValid = await user.isPasswordCorrect(oldPassword);
    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid user credentials.");
    }

    user.password = newPassword;
    user.refreshToken = undefined;

    await user.save({ validateBeforeSave: true });

    res.status(200).json(
      new ApiResponse(
        200,
        { id: user._id, username: user.username, email: user.email },
        "Password changed successfully. Please log in again with your new password."
      )
    );
  } catch (error) {
    console.error("Change password error:", error);

    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        statusCode: error.statusCode,
        message: error.message,
        success: false,
      });
    }

    return res.status(500).json({
      statusCode: 500,
      success: false,
      message: "Something went wrong while changing your password. Please try again later.",
    });
  }
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

export { loginUser, logoutUser, sendEmailVerification, verifyEmail };
