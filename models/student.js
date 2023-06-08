const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    college: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      required: true,
    },
    batch: {
      type: String,
      required: true,
    },
    interviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Interviews",
      },
    ],
    dsa: {
      type: Number,
      min: 0,
      max: 1200,
    },
    webd: {
      type: Number,
      min: 0,
      max: 1200,
    },
    react: {
      type: Number,
      min: 0,
      max: 1200,
    },
  },
  {
    timestamps: true,
  }
);

const Student = mongoose.model("Students", studentSchema);

module.exports = Student;
