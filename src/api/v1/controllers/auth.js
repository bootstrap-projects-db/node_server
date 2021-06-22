import User from "../models/User";
import asyncHandler from "../middlewares/asyncHandler";

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
