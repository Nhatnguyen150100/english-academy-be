const { Schema, model } = require("mongoose");

const missionDailySchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
      required: true,
    },
    loggedIn: {
      type: Boolean,
      default: false,
    },
    completedExam: {
      type: Boolean,
      default: false,
    },
    isConfirmed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const MissionDaily = model("MissionDaily", missionDailySchema);

module.exports = { MissionDaily };
