"use strict";

import { BaseErrorResponse, BaseSuccessResponse } from "../config/baseResponse";
import { User } from "../models/user";
import logger from "../config/winston";
import { ExamCompletion } from "../models/examCompletion";
import { Exam } from "../models/exam";

const rankService = {
  getRankings: async (query) => {
    try {
      const { name } = query;
      const filter = {
        score: { $gt: 0 },
        ...(name && {
          name: {
            $regex: name,
            $options: "i",
          },
        }),
      };

      const rankings = await User.find(filter)
        .sort({ score: -1 })
        .select("name score accountType")
        .lean();

      const listRanks = rankings.map((rank, index) => ({
        ...rank,
        rankNumber: index + 1,
      }));

      return new BaseSuccessResponse({
        data: listRanks,
        message: "Rankings retrieved successfully.",
      });
    } catch (error) {
      logger.error(error.message);
      throw new BaseErrorResponse({
        message: error.message,
      });
    }
  },

  getUserRank: async (userId) => {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new BaseErrorResponse({
          message: "User not found.",
        });
      }

      if (user.score <= 0) {
        return new BaseSuccessResponse({
          data: {
            rank: null,
            completedExams: 0,
            totalExams: 0,
            message: "User does not have a rank due to score being 0.",
          },
        });
      }

      const rank = await User.countDocuments({ score: { $gt: user.score } });

      const completedExams = await ExamCompletion.countDocuments({ userId });

      const totalExams = await Exam.countDocuments();

      return new BaseSuccessResponse({
        data: {
          rank: rank + 1,
          score: user.score,
          accountType: user.accountType,
          completedExams,
          totalExams,
        },
        message: "User rank retrieved successfully.",
      });
    } catch (error) {
      logger.error(error.message);
      throw new BaseErrorResponse({
        message: error.message,
      });
    }
  }
};

export default rankService;
