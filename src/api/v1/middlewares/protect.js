import jwt from "jsonwebtoken";
import asyncHandler from "./asyncHandler";
import CustomError from "../utils/customError";
import User from "../models/User";

// Protect routes
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    // check if Bearer token is tin the authorization header
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  // else if (req.cookies.token) {
  //   // token is set in the cookies -> so no need for authorization header with Bearer token
  //   token = req.cookies.token;
  // }

  // Make sure token exists
  if (!token) {
    // 401-> not authorized
    return next(new CustomError("Not authorized to access this route!", 401));
  }

  try {
    //verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("decoded token: ", decoded);

    // decoded contains an id which is the user id
    req.user = await User.findById(decoded.id);

    next();
  } catch (error) {
    return next(new CustomError("Not authorized to access this route!", 401));
  }
});

export { protect };
