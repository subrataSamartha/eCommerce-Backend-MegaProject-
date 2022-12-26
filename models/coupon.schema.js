import mongoose from "mongoose";

const couponSchema = new mongoose.schema(
  {
    code: {
      type: String,
      required: ["true", "Please provide coupon name"],
    },
    discount: {
      type: Number,
      default: 0,
    },
    sctive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Coupon", couponSchema);
