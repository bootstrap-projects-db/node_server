import mongoose from "mongoose";
import { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
  },
  email: {
    type: String,
    required: [true, "please add an email"],
    unique: true,
    match: [
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please add a valid email",
    ],
  },
  role: {
    type: String,
    enum: ["ADMIN", "MEMBER", "GUEST"],
    default: "MEMBER",
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
    minLength: 5,
    //dont show password when returning a user model instance
    select: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

//encrypt password with bcrypt
UserSchema.pre("save", async function (next) {
  // if the user password is not modified just call next middleware
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);

  //hash password with salt
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

// sign JWT and return
UserSchema.methods.getSignedToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });
};

// formate user
UserSchema.methods.format = function () {
  var obj = this.toObject();

  //Rename fields
  obj.id = obj._id;
  delete obj._id;

  return obj;
};

//match user password from request to hashed password in db
UserSchema.methods.matchPassword = async function (requestPassword) {
  return await bcrypt.compare(requestPassword, this.password);
};

export default mongoose.model("User", UserSchema);
