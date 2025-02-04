"use strict";

import { BaseErrorResponse, BaseSuccessResponse } from "../config/baseResponse";
import { User } from "../models/user";
import { ExamCompletion } from "../models/examCompletion";
import { MissionDaily } from "../models/missionDaily";
import logger from "../config/winston";
import { MAX_EXAM_ATTEMPT_WITH_FREE_ACCOUNT } from "../constants/exam";
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
          userAnser: answer.answer
        };
      });

      const allAnswered = results.every((item) => item.correctAnswer === item.answer);
      if (!allAnswered) {
        return new BaseSuccessResponse({
          message: "You have not answered all questions.",
          data: results,
        });
      }

      // tăng điểm cho user
      await User.findByIdAndUpdate(
        userId,
        { $inc: { score: getScoreFromExam(exam.level) } },
        { new: true },
      );

      // kiểm tra nhiệm vụ hàng ngày
      const missionDaily = await MissionDaily.findOne({
        userId,
      });

      if (!missionDaily.completedExam) {
        await MissionDaily.findByIdAndUpdate(
          missionDaily._id,
          { completedExam: true },
          { new: true },
        );
      }

      const examCompletion = new ExamCompletion({
        userId,
        examId,
        completedDate: new Date(),
      });
      await examCompletion.save();

      return new BaseSuccessResponse({
        data: { results, score: getScoreFromExam(exam.level) },
        message: "Exam submitted successfully.",
      });
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
};

export default examCompletionService;
