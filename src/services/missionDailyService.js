"use strict";

import { BaseErrorResponse, BaseSuccessResponse } from "../config/baseResponse";
import logger from "../config/winston";
import { MissionDaily } from "../models/missionDaily";
import { User } from "../models/user";
import DEFINE_SCORE from "../constants/score"

const missionDailyService = {
  getMissionDaily: async (userId) => {
    try {
      const now = new Date();
      const startOfTodayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
      const endOfTodayUTC = new Date(startOfTodayUTC);
      endOfTodayUTC.setUTCDate(endOfTodayUTC.getUTCDate() + 1);
  
      const missionDaily = await MissionDaily.findOne({
        userId,
        date: { $gte: startOfTodayUTC, $lt: endOfTodayUTC }
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
      const now = new Date();
      const startOfTodayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
      const endOfTodayUTC = new Date(startOfTodayUTC);
      endOfTodayUTC.setUTCDate(endOfTodayUTC.getUTCDate() + 1);
  
      const missionCheck = await MissionDaily.findOne({
        userId,
        date: { $gte: startOfTodayUTC, $lt: endOfTodayUTC }
      });
      if(missionCheck?.loggedIn) {
        return new BaseErrorResponse({
          message: "You have already logged in today",
        });
      }
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

      if (!missionDaily?.loggedIn) {
        return new BaseErrorResponse({
          message: "Please log in first to confirm mission daily",
        });
      }

      if (!missionDaily?.completedExam) {
        return new BaseErrorResponse({
          message: "Please complete the exam to confirm mission daily",
        });
      }

      if(missionDaily?.loggedIn && missionDaily?.completedExam && missionDaily?.isConfirmed) {
        return new BaseErrorResponse({
          message: "Mission daily has already been confirmed",
        });
      }

      await MissionDaily.findByIdAndUpdate(missionDaily._id, { isConfirmed: true });

      await User.findByIdAndUpdate(
        missionDaily.userId,
        { $inc: { score: DEFINE_SCORE.SCORE_MISSION_DAILY } }
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
