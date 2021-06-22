import User from "../models/User";
import asyncHandler from "../middlewares/asyncHandler";
import CustomError from "../utils/customError";

// @desc    Register user
// @route   POST /api/v1/auth/register
export const register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  // create user
  const user = await User.create({ name, email, password, role });

  // create token
  const token = user.getSignedToken();

  res.status(200).json({ success: true, token });
});

// @desc    Login user
// @route   POST /api/v1/auth/login
export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // validate email and password
  if (!email || !password) {
    return next(new CustomError("Please provide an email and password", 400));
  }

  //check if user exists
  // select("+password") -> add password to findOne response
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new CustomError("Invalid credentials", 401));
  }

  // check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new CustomError("Invalid credentials", 401));
  }

  // create token
  const token = user.getSignedToken();

  res.status(200).json({ success: true, token });
});
