import crypto from "crypto";
import User from "../models/User";
import asyncHandler from "../middlewares/asyncHandler";
import CustomError from "../utils/customError";
import sendEmail from "../utils/sendEmail";

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  public
export const register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  // create user
  const user = await User.create({ name, email, password, role });

  sendTokenResponse(user, 200, res);
});

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  public
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

  sendTokenResponse(user, 200, res);
});

// @desc    Get logged in user
// @route   GET /api/v1/auth/current-user
// @access  private
export const currentUser = asyncHandler(async (req, res, next) => {
  // create user
  const user = await User.findById(req.user.id);

  res.status(200).json({ success: true, data: { user } });
});

// @desc    Get logged in user
// @route   POST /api/v1/auth/forgotpassword
// @access  public
export const forgotPassword = asyncHandler(async (req, res, next) => {
  // create user
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new CustomError("There is no user with that email", 401));
  }

  // set resetPasswordToken at the user
  const resetToken = user.getResetPasswordToken();

  // save generated resetPasswordToken to db
  await user.save({ validateBeforeSave: false });

  // console.log("reset token:", resetToken);

  // create reset url
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/auth/resetpassword/${resetToken}`;

  const message = `You are receiving this email bacause you (or someone else) has requested the reset of password. Please make a POST request to: \n\n ${resetUrl} `;

  try {
    await sendEmail({
      recievers: user.email,
      subject: "Password reset token",
      message,
    });
  } catch (error) {
    console.log(error);

    // reset password token
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new CustomError("Email could not be sent."));
  }

  res.status(200).json({ success: true, data: "Email sent!" });
});

// @desc    Reset password
// @route   PUT /api/v1/auth/resetpassword/:resettoken
// @access  private
export const resetPassword = asyncHandler(async (req, res, next) => {
  // get hashed token
  // const resetPasswordToken = crypto
  //   .createHash("sha256")
  //   .update(req.params.resettoken)
  //   .digest("hex");
  const resetPasswordToken = req.params.resettoken;

  console.log("reset pw", req.params.resettoken);
  console.log("is string", typeof req.params.resettoken);
  // create user
  const user = await User.findOne({
    resetPasswordToken: "dbddaad0584211fdf54f1b8481c01025d4a9996b",
  });

  console.log("user", user);

  if (!user) {
    return next(new CustomError("Invalid token", 400));
  }

  // set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendTokenResponse(user, 200, res);
});

// get token from model create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // create token
  const token = user.getSignedToken();

  // cookie options
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    // cookie only accessible through client side scripts
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    // if secure is true -> cookie will be sent with https
    options.secure = true;
  }

  res
    .status(statusCode)
    // set cookie in response with a token variable
    .cookie("token", token, options)
    .json({ success: true, token });
};
