const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema(
  {
    interview: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Interview",
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Students",
      required: true,
    },
    result: {
      type: String,
      enum: ["PASS", "FAIL", "ON_HOLD", "DIDNT_ATTEMPT"],
      // required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Result = mongoose.model("Result", resultSchema);

module.exports = Result;
