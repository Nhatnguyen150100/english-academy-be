"use strict";
import {
  BaseErrorResponse,
  BaseSuccessResponse,
} from "../config/baseResponse.js";
import logger from "../config/winston.js";
import { Chapter } from "../models/chapter.js";
import { Exam } from "../models/exam.js";
import examCompletionService from "./examCompletionService.js";

const examService = {
  createExam: async (examData) => {
    try {
      if (!examData.chapterId) {
        return new BaseErrorResponse({
          message: "chapterId is required",
        });
      }

      const exam = new Exam(examData);
      const savedExam = await exam.save();

      await Chapter.findByIdAndUpdate(examData.chapterId, {
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
        .populate({
          path: "chapterId",
          select: "title courseId",
          populate: {
            path: "courseId",
            select: "name",
          },
        })
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

  getExamsByChapterId: async (
    chapterId,
    page = 1,
    limit = 10,
    searchTerm = "",
  ) => {
    try {
      const query = searchTerm
        ? { name: { $regex: searchTerm, $options: "i" }, chapterId }
        : { chapterId };

      const exams = await Exam.find(query)
        .select("-questions")
        .sort({ order: 1, createdAt: -1 })
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
      const exam = await Exam.findById(id).populate({
        path: "chapterId",
        select: "title courseId",
      });

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
      const isAttempted =
        await examCompletionService.checkExamIsAttemptByUser(userId, id);

      return new BaseSuccessResponse({
        data: { ...examObject, isCompleted, isAttempted },
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
      }).populate("chapterId");

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
      const exam = await Exam.findById(id);
      if (!exam) {
        return new BaseErrorResponse({
          message: "Exam not found",
        });
      }

      await Chapter.findByIdAndUpdate(exam.chapterId, {
        $pull: { exams: id },
      });

      const deletedExam = await Exam.findByIdAndDelete(id);

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
