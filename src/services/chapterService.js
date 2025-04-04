"use strict";
import {
  BaseErrorResponse,
  BaseSuccessResponse,
} from "../config/baseResponse.js";
import logger from "../config/winston.js";
import { Course } from "../models/courses.js";
import { Chapter } from "../models/chapter.js";
import { Exam } from "../models/exam.js";

const chapterService = {
  createChapter: async (chapterData) => {
    try {
      const course = await Course.findById(chapterData.courseId);
      if (!course) {
        return new BaseErrorResponse({
          message: "Course not found",
        });
      }

      if (!chapterData.order) {
        const chapterCount = await Chapter.countDocuments({
          courseId: chapterData.courseId,
        });
        chapterData.order = chapterCount + 1;
      }

      const chapter = new Chapter(chapterData);
      const savedChapter = await chapter.save();

      await Course.findByIdAndUpdate(chapterData.courseId, {
        $addToSet: { chapters: savedChapter._id },
      });

      return new BaseSuccessResponse({
        data: savedChapter,
        message: "Chapter created successfully",
      });
    } catch (error) {
      logger.error(error.message);
      return new BaseErrorResponse({
        message: error.message,
      });
    }
  },

  getChaptersByCourseId: async (courseId, page = 1, limit = 10) => {
    try {
      const query = { courseId };

      const chapters = await Chapter.find(query)
        .sort({ order: 1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate({
          path: "exams",
          select: "name description timeExam level order",
          options: { sort: { order: 1 } },
        });

      const totalChapters = await Chapter.countDocuments(query);

      return new BaseSuccessResponse({
        data: {
          data: chapters,
          total: totalChapters,
          page,
          totalPages: Math.ceil(totalChapters / limit),
        },
        message: "Fetched chapters successfully",
      });
    } catch (error) {
      logger.error(error.message);
      throw new BaseErrorResponse({
        message: error.message,
      });
    }
  },

  getChapterById: async (id) => {
    try {
      const chapter = await Chapter.findById(id)
        .populate({
          path: "exams",
          select: "-questions",
          options: { sort: { order: 1 } },
        })
        .populate({
          path: "courseId",
          select: "name description",
        });

      if (!chapter) {
        return new BaseErrorResponse({
          message: "Chapter not found",
        });
      }

      return new BaseSuccessResponse({
        data: chapter,
        message: "Fetched chapter successfully",
      });
    } catch (error) {
      logger.error(error.message);
      throw new BaseErrorResponse({
        message: error.message,
      });
    }
  },

  updateChapter: async (id, updateData) => {
    try {
      const updatedChapter = await Chapter.findByIdAndUpdate(id, updateData, {
        new: true,
      }).populate("exams");

      if (!updatedChapter) {
        return new BaseErrorResponse({
          message: "Chapter not found",
        });
      }

      return new BaseSuccessResponse({
        data: updatedChapter,
        message: "Chapter updated successfully",
      });
    } catch (error) {
      logger.error(error.message);
      throw new BaseErrorResponse({
        message: error.message,
      });
    }
  },

  deleteChapter: async (id) => {
    try {
      const chapter = await Chapter.findById(id);
      if (!chapter) {
        return new BaseErrorResponse({
          message: "Chapter not found",
        });
      }

      await Exam.deleteMany({ chapterId: id });

      await Course.findByIdAndUpdate(chapter.courseId, {
        $pull: { chapters: id },
      });

      const deletedChapter = await Chapter.findByIdAndDelete(id);

      return new BaseSuccessResponse({
        data: deletedChapter,
        message: "Chapter and related exams deleted successfully",
      });
    } catch (error) {
      logger.error(error.message);
      throw new BaseErrorResponse({
        message: error.message,
      });
    }
  },

  reorderChapters: async (courseId, data) => {
    try {
      const { newOrder } = data;
      const bulkOps = newOrder.map((chapterId, index) => ({
        updateOne: {
          filter: { _id: chapterId, courseId },
          update: { $set: { order: index + 1 } },
        },
      }));

      await Chapter.bulkWrite(bulkOps);

      const updatedChapters = await Chapter.find({ courseId }).sort({
        order: 1,
      });

      return new BaseSuccessResponse({
        data: updatedChapters,
        message: "Chapters reordered successfully",
      });
    } catch (error) {
      logger.error(error.message);
      throw new BaseErrorResponse({
        message: error.message,
      });
    }
  },
};

export default chapterService;
