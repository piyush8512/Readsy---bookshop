import {ApiError} from "../utils/Api.error.js";
import  asyncHandler  from '../utils/asyncHandler.js';

export const authorizeAdmin = asyncHandler(async (req, res, next) => {
    if (!req.user) {
        throw new ApiError(401, "Unauthorized: User not authenticated.");
    }
    console.log("User role:", req.user.role); 
    if (req.user.role !== 'admin') {
        throw new ApiError(403, "Forbidden: Only administrators are allowed to perform this action.");
    }
    next();
});
