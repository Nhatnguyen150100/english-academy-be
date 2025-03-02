"use strict";
import {
  BaseErrorResponse,
  BaseSuccessResponse,
} from "../config/baseResponse.js";
import logger from "../config/winston.js";
import { Course } from "../models/courses.js";
import { Exam } from "../models/exam.js";

const courseService = {
  createCourse: async (courseData) => {
    try {
      const course = new Course(courseData);
      const savedCourse = await course.save();
      return new BaseSuccessResponse({
        data: savedCourse,
        message: "Course created successfully",
      });
    } catch (error) {
      logger.error(error.message);
      throw new BaseErrorResponse({
        message: error.message,
      });
    }
  },

  getCourses: async (page = 1, limit = 10, searchTerm = "") => {
    try {
      const query = searchTerm
        ? { name: { $regex: searchTerm, $options: "i" } }
        : {};

      const courses = await Course.find(query)
        .populate({
          path: "exams",
          select: "-questions",
        })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

      const totalCourses = await Course.countDocuments(query);

      return new BaseSuccessResponse({
        data: {
          data: courses,
          total: totalCourses,
          page,
          totalPages: totalCourses ? Math.ceil(totalCourses / limit) : 1,
        },
        message: "Fetched courses successfully",
      });
    } catch (error) {
      logger.error(`Error fetching courses: ${error.message}`);
      throw new BaseErrorResponse({
        message: "An error occurred while fetching courses.",
        details: error.message,
      });
    }
  },

  getCourseById: async (id) => {
    try {
      const course = await Course.findById(id);
      if (!course) {
        return new BaseErrorResponse({
          message: "Course not found",
        });
      }

      const exams = await Exam.find({ courseId: id });

      const convertExams = exams.map((item) => {
        const { questions, courseId, ...rest } = item.toObject();
        return rest;
      });

      return new BaseSuccessResponse({
        data: { ...course.toObject(), exams: convertExams },
        message: "Fetched course successfully",
      });
    } catch (error) {
      logger.error(error.message);
      throw new BaseErrorResponse({
        message: error.message,
      });
    }
  },

  updateCourse: async (id, courseData) => {
    try {
      const updatedCourse = await Course.findByIdAndUpdate(id, courseData);
      if (!updatedCourse) {
        return new BaseErrorResponse({
          message: "Course not found",
        });
      }
      return new BaseSuccessResponse({
        data: updatedCourse,
        message: "Course updated successfully",
      });
    } catch (error) {
      logger.error(error.message);
      throw new BaseErrorResponse({
        message: error.message,
      });
    }
  },

  deleteCourse: async (id) => {
    try {
      const course = await Course.findById(id);
      if (!course) {
        return new BaseErrorResponse({
          message: "Course not found",
        });
      }

      await Exam.deleteMany({ courseId: id });

      const deletedCourse = await Course.findByIdAndDelete(id);
      return new BaseSuccessResponse({
        data: deletedCourse,
        message: "Course and related exams deleted successfully",
      });
    } catch (error) {
      logger.error(error.message);
      throw new BaseErrorResponse({
        message: error.message,
      });
    }
  },
};

export default courseService;
