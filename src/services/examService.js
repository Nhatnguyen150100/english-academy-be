"use strict";
import {
  BaseErrorResponse,
  BaseSuccessResponse,
} from "../config/baseResponse.js";
import logger from "../config/winston.js";
import { Exam } from "../models/exam";
import examCompletionService from "./examCompletionService.js";

const examService = {
  createExam: async (examData) => {
    try {
      const exam = new Exam(examData);
      const savedExam = await exam.save();

      if (examData.courseId) {
        await Course.findByIdAndUpdate(
          examData.courseId,
          { $addToSet: { exams: savedExam._id } },
          { new: true },
        );
      }

      return new BaseSuccessResponse({
        data: savedExam,
        message: "Exam created successfully",
      });
    } catch (error) {
      logger.error(error.message);
      throw new BaseErrorResponse({
        message: error.message,
      });
    }
  },

  getExams: async (page = 1, limit = 10, searchTerm = "") => {
    try {
      const query = searchTerm
        ? { name: { $regex: searchTerm, $options: "i" } }
        : {};
      const exams = await Exam.find(query)
        .select("-questions")
        .populate("courseId")
        .skip((page - 1) * limit)
        .limit(limit);

      const totalExams = await Exam.countDocuments(query);

      return new BaseSuccessResponse({
        data: {
          exams,
          total: totalExams,
          page,
          totalPages: Math.ceil(totalExams / limit),
        },
        message: "Fetched exams successfully",
      });
    } catch (error) {
      logger.error(error.message);
      throw new BaseErrorResponse({
        message: error.message,
      });
    }
  },

  getExamById: async (userId, id) => {
    try {
      const exam = await Exam.findById(id);
      if (!exam) {
        return new BaseErrorResponse({
          message: "Exam not found",
        });
      }
      const { canAttempt, message } =
        await examCompletionService.canAttemptExam(userId);
      if (!canAttempt) {
        return new BaseErrorResponse({
          message,
        });
      }
      const examObject = exam.toObject();

      if (examObject.questions) {
        examObject.questions.forEach((question) => {
          delete question.correctAnswer;
        });
      }

      const isCompleted = await examCompletionService.checkExamIsCompletedByUser(userId, id);

      return new BaseSuccessResponse({
        data: {...examObject, isCompleted},
        message,
      });
    } catch (error) {
      logger.error(error.message);
      throw new BaseErrorResponse({
        message: error.message,
      });
    }
  },

  updateExam: async (id, examData) => {
    try {
      const updatedExam = await Exam.findByIdAndUpdate(id, examData, {
        new: true,
      });
      if (!updatedExam) {
        return new BaseErrorResponse({
          message: "Exam not found",
        });
      }
      return new BaseSuccessResponse({
        data: updatedExam,
        message: "Exam updated successfully",
      });
    } catch (error) {
      logger.error(error.message);
      throw new BaseErrorResponse({
        message: error.message,
      });
    }
  },

  deleteExam: async (id) => {
    try {
      const deletedExam = await Exam.findByIdAndDelete(id);
      if (!deletedExam) {
        return new BaseErrorResponse({
          message: "Exam not found",
        });
      }
      return new BaseSuccessResponse({
        data: deletedExam,
        message: "Exam deleted successfully",
      });
    } catch (error) {
      logger.error(error.message);
      throw new BaseErrorResponse({
        message: error.message,
      });
    }
  },
};

export default examService;
