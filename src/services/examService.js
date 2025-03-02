"use strict";
import {
  BaseErrorResponse,
  BaseSuccessResponse,
} from "../config/baseResponse.js";
import logger from "../config/winston.js";
import { Course } from "../models/courses.js";
import { Exam } from "../models/exam";
import examCompletionService from "./examCompletionService.js";

const examService = {
  createExam: async (examData) => {
    try {
      if (!examData.courseId) {
        return new BaseErrorResponse({
          message: "courseId is required",
        });
      }
      const exam = new Exam(examData);
      const savedExam = await exam.save();

      await Course.findByIdAndUpdate(examData.courseId, {
        $addToSet: { exams: savedExam._id },
      });

      return new BaseSuccessResponse({
        data: savedExam,
        message: "Exam created successfully",
      });
    } catch (error) {
      logger.error(error.message);
      return new BaseErrorResponse({
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
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

      const totalExams = await Exam.countDocuments(query);

      return new BaseSuccessResponse({
        data: {
          data: exams,
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

  getExamsByCourseId: async (
    courseId,
    page = 1,
    limit = 10,
    searchTerm = "",
  ) => {
    try {
      const query = searchTerm
        ? { name: { $regex: searchTerm, $options: "i" }, courseId }
        : {courseId};
      const exams = await Exam.find(query)
        .select("-questions")
        .populate("courseId")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

      const totalExams = await Exam.countDocuments(query);

      return new BaseSuccessResponse({
        data: {
          data: exams,
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

  getExamById: async (userId, id, isAdmin) => {
    try {
      const exam = await Exam.findById(id);
      if (!exam) {
        return new BaseErrorResponse({
          message: "Exam not found",
        });
      }

      const { canAttempt, message } = !isAdmin
        ? await examCompletionService.canAttemptExam(userId)
        : {
            canAttempt: true,
            message: "You can attempt this exam.",
          };
      if (!canAttempt) {
        return new BaseErrorResponse({
          message,
        });
      }
      const examObject = exam.toObject();

      if (examObject.questions && !isAdmin) {
        examObject.questions.forEach((question) => {
          delete question.correctAnswer;
        });
      }

      const isCompleted =
        await examCompletionService.checkExamIsCompletedByUser(userId, id);

      return new BaseSuccessResponse({
        data: { ...examObject, isCompleted },
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
      const updatedExam = await Exam.findByIdAndUpdate(id, examData);
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
