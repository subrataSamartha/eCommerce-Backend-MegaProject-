import mongoose from "mongoose";
import AuthRoles from "../utils/authRoles";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
import crypto from "crypto"; // no need to install this library. It is available by default in NodeJs
import config from "../config/index";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      maxLength: [50, "Name must be less than 50"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minLength: [8, "Password must be at least 8 characters"],
      select: false, // whenever you query a dataabase, it ensures that the password fieald never passed as a response
    },

    role: {
      type: String,
      enum: Object.values(AuthRoles), //Object.values will return an array of values inside authrole
      default: AuthRoles.USER,
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
  },
  {
    timestamps: true,
  }
);

/**
 * @todo encrypt password
 *  */

userSchema.pre("save", async function (next) {
  //use function keyword. Don't use arrow function perticularly here
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

/**
 * add more featuers directly to your schema
 */
userSchema.methods = {
  //compare password
  comparePassword: async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  },

  //generate JWT token
  getJWTToken: function () {
    return JWT.sign(
      {
        _id: this._id,
        role: this.role,
      },
      config.JWT_SECRET,
      {
        expiredIn: config.JWT_EXPIRY,
      }
    );
  },
};

export default mongoose.model("User", userSchema); //im mongoose the name will be "Users"
