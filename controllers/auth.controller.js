import User from "../models/user.schema";
import asyncHandler from "../services/asyncHandler";
import CustomError from "../utils/customError";

export const cookieOptions = {
  expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
  httpOnly: true,
  //could be in a separate file in utils
};

/*******************************************************************************************************************
 * @SIGNUP
 * @route http://localhost:4000/api/auth/signup
 * @description User signup controller for creating a new user
 * @parameters name, email, password
 * @return User Object
 *
 *****************************************************************************************************************/

export const signUp = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new CustomError("please fill all fields", 400);
  }

  //check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new CustomError("User already exists", 400);
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  const token = user.getJWTToken;
  user.password = undefined;

  res.cookie("token", token, cookieOptions);
  res.status(200).json({
    success: true,
    token,
    user,
  });
});

/*******************************************************************************************************************
 * @LOGIN
 * @route http://localhost:4000/api/auth/login
 * @description User signIn controller for loging user
 * @parameters email, password
 * @return User Object
 *
 *****************************************************************************************************************/

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new CustomError("please fill all fields", 400);
  }

  const user = User.findOne({ email }).select("+password");

  if (!user) {
    throw new CustomError("Invalid credentials", 400);
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (isPasswordMatched) {
    const token = user.getJWTToken();
    user.password = undefined;
    res.cookie("token", token, cookieOptions);
    return res.status(200).json({
      success: true,
      token,
      user,
    });
  }

  throw new CustomError("INvalid credentials", 400);
});

/*******************************************************************************************************************
 * @LOGOUT
 * @route http://localhost:4000/api/auth/logout
 * @description User logout by clearing user cookies
 * @parameters N/A
 * @return success message
 *
 *****************************************************************************************************************/
export const logout = asyncHandler(async (_req, res) => {
  // res.clearCookie()
  res.cookie("token", null, {
    expires: new Date(Date.now),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});
