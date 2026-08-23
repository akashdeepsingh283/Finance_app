import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { serializeUser } from "../utils/serializers.js";
import { createToken } from "../utils/token.js";
import { requiredText } from "../utils/validation.js";

function sendAuthResponse(res, statusCode, message, user) {
  res.status(statusCode).json({
    message,
    token: createToken(user._id),
    user: serializeUser(user),
  });
}

export const register = asyncHandler(async (req, res) => {
  const name = requiredText(req.body.name, "name");
  const email = requiredText(req.body.email, "email").toLowerCase();
  const password = requiredText(req.body.password, "password");

  if (password.length < 8) {
    throw new ApiError(400, "password must contain at least 8 characters.");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "An account with this email already exists.");
  }

  const user = await User.create({ name, email, password });
  sendAuthResponse(res, 201, "Account created.", user);
});

export const login = asyncHandler(async (req, res) => {
  const email = requiredText(req.body.email, "email").toLowerCase();
  const password = requiredText(req.body.password, "password");
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, "Incorrect email or password.");
  }

  sendAuthResponse(res, 200, "Signed in.", user);
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  res.json({ user: serializeUser(req.user) });
});
