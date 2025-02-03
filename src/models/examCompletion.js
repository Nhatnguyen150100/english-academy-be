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
    completedDate: {
      type: Date,
      default: Date.now,
      required: true,
    },
  },
  { timestamps: true },
);

const ExamCompletion = model("ExamCompletion", examCompletionSchema);

module.exports = ExamCompletion;
