import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    avatar: {
      type: String, // cloudinary url
      default: "",
    },
    username: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
    },
    OTP: {
      type: String,
      default: undefined,
    },
    otpExpiry: {
      type: Date,
      default: undefined,
    },
  },
  {
    timestamps: true,
  }
);

// middleware: bcrypt password hashing
userSchema.pre("save", async function () {
  // check: if password is changed while updating user details on userSchema
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});

// mongoose pre-defined methods on userSchema

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

// password validation:
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.hashOTP = async function (otp) {
  this.OTP = await bcrypt.hash(otp.toString(), 10);
  this.otpExpiry = Date.now() + 2 * 60 * 1000;

  return await this.save();
};

userSchema.methods.isOtpCorrect = async function (userOTP) {
  return bcrypt.compare(userOTP, this.OTP);
};

export const User = mongoose.model("User", userSchema);
