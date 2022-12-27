import User from "../models/user.schema";
import JWT from "jsonwebtoken";
import asyncHandler from "../services/asyncHandler";
import customError from "../utils/customError";
import config from "../config/index";

export const isLoggedIn = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.cookies.token ||
    (req.header.authorization && req.headers.authorization.startsWith("Bearer"))
  ) {
    token = req.cookies.token || req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    throw new customError("Not authorised to access this route", 401);
  }

  try {
    const decodedJwtPayload = JWT.verify(token, config.JWT_SECRET);

    //grab _id, find user based on id, set this in req.user
    req.user = await User.findById(decodedJwtPayload._id, "name email role");
    next();
  } catch (error) {
    throw new customError("Not authorized to access this route", 401);
  }
});
