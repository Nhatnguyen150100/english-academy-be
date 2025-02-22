const { Schema, model } = require("mongoose");

const examCompletionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    examId: {
      type: Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },
    score: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
      default: 0,
    },
    completedDate: {
      type: Date,
      default: Date.now,
      required: true,
    },
  },
  { timestamps: true },
);

const ExamCompletion = model("ExamCompletion", examCompletionSchema);

module.exports = { ExamCompletion };
