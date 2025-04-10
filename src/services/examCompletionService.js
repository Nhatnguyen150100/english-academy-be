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
        throw new BaseErrorResponse({ message: "Exam not found" });
      }

      const results = await Promise.all(
        exam.questions.map(async (_question) => {
          const answer = listAnswer.find(
            (q) => q.questionId.toString() === _question._id.toString(),
          );

          if (!answer) {
            return {
              questionId: _question._id.toString(),
              correctAnswer: _question.correctAnswer,
              userAnswer: _question.type === "MCQ" ? "" : [],
              isCorrect: false,
            };
          }

          let isCorrect = false;

          if (_question.type === "MCQ") {
            isCorrect = answer.answer === _question.correctAnswer.toString();
          } else if (_question.type === "ARRANGE") {
            const userAnswer = Array.isArray(answer.answer)
              ? answer.answer
              : [answer.answer];

            isCorrect =
              JSON.stringify(userAnswer) ===
              JSON.stringify(_question.correctAnswer);
          }

          return {
            questionId: answer.questionId,
            correctAnswer: _question.correctAnswer,
            userAnswer: answer?.answer,
            isCorrect,
          };
        }),
      );

      const score = results.reduce((accumulator, currentValue) => {
        return accumulator + (currentValue.isCorrect ? 1 : 0);
      }, 0);

      const averageScore = Math.round((score / exam.questions.length) * 100);

      const allCorrect = results.every((result) => result.isCorrect);

      const examCompletion = new ExamCompletion({
        userId,
        examId,
        score: averageScore,
        completedDate: new Date(),
      });

      const isCompleted =
        await examCompletionService.checkExamIsCompletedByUser(userId, examId);

      await examCompletion.save();

      if (!allCorrect) {
        return new BaseSuccessResponse({
          message: "Not all answers are correct",
          data: { results, score: averageScore },
        });
      }

      if (!isCompleted) {
        // tăng điểm cho user
        await User.findByIdAndUpdate(userId, {
          $inc: { score: getScoreFromExam(exam.level) },
        });

        // kiểm tra nhiệm vụ hàng ngày
        const now = new Date();
        const startOfTodayUTC = new Date(
          Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
        );
        const endOfTodayUTC = new Date(startOfTodayUTC);
        endOfTodayUTC.setUTCDate(endOfTodayUTC.getUTCDate() + 1);

        const missionCheck = await MissionDaily.findOne({
          userId,
          date: { $gte: startOfTodayUTC, $lt: endOfTodayUTC },
        });

        if (!missionCheck) {
          const missionDaily = new MissionDaily({
            userId,
            loggedIn: true,
          });

          await missionDaily.save();
        } else if (!missionCheck.completedExam) {
          await MissionDaily.findByIdAndUpdate(missionCheck._id, {
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
