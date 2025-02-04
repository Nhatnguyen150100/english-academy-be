"use strict";

import { BaseErrorResponse, BaseSuccessResponse } from "../config/baseResponse";
import logger from "../config/winston";
import { MissionDaily } from "../models/missionDaily";
import { User } from "../models/user";
import DEFINE_SCORE from "../constants/score"

const missionDailyService = {
  getMissionDaily: async (userId) => {
    try {
      const missionDaily = await MissionDaily.findOne({
        userId,
      });

      return new BaseSuccessResponse({
        data: missionDaily,
        message: "Mission daily data retrieved successfully",
      });
    } catch (error) {
      logger.error(error.message);
      throw new BaseErrorResponse({
        message: error.message,
      });
    }
  },
  createMissionDaily: async (userId) => {
    try {
      const missionDaily = new MissionDaily({
        userId,
        loggedIn: true
      })

      await missionDaily.save();

      return new BaseSuccessResponse({
        message: "Mission daily logged in created successfully",
      });
    } catch (error) {
      logger.error(error.message);
      throw new BaseErrorResponse({
        message: error.message,
      });
    }
  },
  confirmMissionDaily: async (missionDailyId) => {
    try {
      const missionDaily = await MissionDaily.findById(missionDailyId);

      if (!missionDaily.loggedIn) {
        return new BaseErrorResponse({
          message: "Please log in first to confirm mission daily",
        });
      }

      if (!missionDaily.completedExam) {
        return new BaseErrorResponse({
          message: "Please complete the exam to confirm mission daily",
        });
      }

      await MissionDaily.findByIdAndUpdate(missionDailyId, { confirmed: true });

      await User.findByIdAndUpdate(
        missionDaily.userId,
        { $inc: { score: DEFINE_SCORE.SCORE_MISSION_DAILY } },
        { new: true },
      );

      return new BaseSuccessResponse({
        message: "Mission daily confirmed successfully",
      });
    } catch (error) {
      logger.error(error.message);
      throw new BaseErrorResponse({
        message: error.message,
      });
    }
  },
};

export default missionDailyService;
