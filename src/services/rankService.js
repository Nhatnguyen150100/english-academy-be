"use strict";

import { BaseErrorResponse, BaseSuccessResponse } from "../config/baseResponse";
import { User } from "../models/user";
import logger from "../config/winston";
import { ExamCompletion } from "../models/examCompletion";
import { Exam } from "../models/exam";

const rankService = {
  getRankings: async (page = 1, limit = 10, name = "") => {
    try {
      const query = {
        score: { $gt: -1 },
        role: "USER",
        ...(name && {
          name: {
            $regex: name,
            $options: "i",
          },
        }),
      };

      const rankings = await User.find(query)
        .sort({ score: -1 })
        .select("name email score accountType")
        .lean()
        .skip((page - 1) * limit)
        .limit(limit);

      const totalRecord = await User.countDocuments(query);

      const listRanks = rankings.map((rank, index) => ({
        ...rank,
        rankNumber: (page - 1) * limit + index + 1,
      }));
      console.log("🚀 ~ listRanks ~ listRanks:", listRanks)

      return new BaseSuccessResponse({
        data: {
          data: listRanks,
          total: totalRecord,
          page,
          totalPages: Math.ceil(totalRecord / limit) ?? 1,
        },
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
  },
};

export default rankService;
