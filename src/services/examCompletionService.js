"use strict";

import { BaseErrorResponse, BaseSuccessResponse } from "../config/baseResponse";
import { User } from "../models/user";
import { ExamCompletion } from "../models/examCompletion";
import { MissionDaily } from "../models/missionDaily";
import logger from "../config/winston";
import {
  MAX_EXAM_ATTEMPT_WITH_FREE_ACCOUNT,
  MAX_EXAM_ATTEMPT_WITH_PREMIUM_ACCOUNT,
} from "../constants/exam";
import { Exam } from "../models/exam";
import getScoreFromExam from "../utils/get-score-from-exam";

const examCompletionService = {
  /**
   * @todo kiểm tra xem làm bài có đúng toàn bộ không
   * @param {*} examId
   * @param {*} listAnswer Array<{questionId: string, answer: string}>
   */
  submitExam: async (userId, examId, listAnswer) => {
    try {
      const exam = await Exam.findById(examId);
      if (!exam) {
        throw new BaseErrorResponse({
          message: "Exam not found",
        });
      }

      const results = listAnswer.map((answer) => {
        const question = exam.questions.find(
          (q) => q._id.toString() === answer.questionId,
        );
        return {
          questionId: answer.questionId,
          correctAnswer: question.correctAnswer,
          userAnswer: answer.answer,
        };
      });

      const allAnswered = results.every(
        (item) => item.correctAnswer === item.userAnswer,
      );

      const score = results.reduce((accumulator, currentValue) => {
        return (
          accumulator +
          (currentValue.correctAnswer === currentValue.userAnswer ? 1 : 0)
        );
      }, 0);

      const averageScore = Math.round((score / exam.questions.length) * 100);

      const examCompletion = new ExamCompletion({
        userId,
        examId,
        score: averageScore,
        completedDate: new Date(),
      });
      await examCompletion.save();

      if (!allAnswered) {
        return new BaseSuccessResponse({
          message: "You have not answered all questions.",
          data: {
            results,
            score,
          },
        });
      }

      const isCompleted = examCompletionService.checkExamIsCompletedByUser(
        userId,
        examId,
      );

      if (!isCompleted) {
        // tăng điểm cho user
        await User.findByIdAndUpdate(userId, {
          $inc: { score: getScoreFromExam(exam.level) },
        });

        // kiểm tra nhiệm vụ hàng ngày
        const missionDaily = await MissionDaily.findOne({
          userId,
        });

        if (!missionDaily.completedExam) {
          await MissionDaily.findByIdAndUpdate(missionDaily._id, {
            completedExam: true,
          });
        }
      }

      return new BaseSuccessResponse({
        data: { results, score },
        message: "Exam submitted successfully.",
      });
    } catch (error) {
      logger.error(error.message);
      throw new BaseErrorResponse({
        message: error.message,
      });
    }
  },
  checkExamIsCompletedByUser: async (userId, examId) => {
    try {
      const examCompletion = await ExamCompletion.findOne({
        userId,
        examId,
        score: 100,
      });
      return !!examCompletion;
    } catch (error) {
      logger.error(error.message);
      throw new BaseErrorResponse({
        message: error.message,
      });
    }
  },
  canAttemptExam: async (userId) => {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found.");
      }

      if (user.accountType === "PREMIUM")
        return {
          canAttempt: true,
          numberExamAttempt: MAX_EXAM_ATTEMPT_WITH_PREMIUM_ACCOUNT,
          message: `You have ${MAX_EXAM_ATTEMPT_WITH_PREMIUM_ACCOUNT} more attempts to take the exam.`,
        };

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const examsCompletedToday = await ExamCompletion.find({
        userId: userId,
        completedDate: { $gte: today },
      });

      const completedCount = examsCompletedToday.length;
      if (
        user.accountType === "FREE" &&
        completedCount >= MAX_EXAM_ATTEMPT_WITH_FREE_ACCOUNT
      ) {
        return {
          canAttempt: false,
          message: "You have reached the limit of 5 exams for the day.",
        };
      }

      return {
        canAttempt: true,
        numberExamAttempt: MAX_EXAM_ATTEMPT_WITH_FREE_ACCOUNT - completedCount,
        message: `You have ${
          MAX_EXAM_ATTEMPT_WITH_FREE_ACCOUNT - completedCount
        } more attempts to take the exam.`,
      };
    } catch (error) {
      logger.error(error.message);
      throw new BaseErrorResponse({
        message: error.message,
      });
    }
  },
  checkNumberExamAttempt: (userId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const { numberExamAttempt } =
          await examCompletionService.canAttemptExam(userId);
        return resolve(
          new BaseSuccessResponse({
            data: numberExamAttempt,
            message: "Get number exam attempt successfully.",
          }),
        );
      } catch (error) {
        logger.error(error.message);
        return reject(
          new BaseErrorResponse({
            message: error.message,
          }),
        );
      }
    });
  },
  getHistory: (userId, page = 1, limit = 10) => {
    return new Promise(async (resolve, reject) => {
      try {
        const query = { userId };
        const exams = await ExamCompletion.find(query)
          .populate("examId", "name description level")
          .sort({ completedDate: -1 })
          .skip((page - 1) * limit)
          .limit(limit);
        const totalRecord = await User.countDocuments(query);
        return resolve(
          new BaseSuccessResponse({
            data: {
              data: exams,
              total: totalRecord,
              page,
              totalPages: Math.ceil(totalRecord / limit) ?? 1,
            },
            message: "History retrieved successfully.",
          }),
        );
      } catch {
        logger.error(error.message);
        return reject(
          new BaseErrorResponse({
            message: error.message,
          }),
        );
      }
    });
  },
};

export default examCompletionService;
