"use strict";

import logger from "../config/winston";
import courseService from "../services/courseService";

const courseController = {
  createCourse: async (req, res) => {
    try {
      const courseData = req.body;
      const rs = await courseService.createCourse(courseData);
      res.status(rs.status).json(rs);
    } catch (error) {
      logger.error(error.message);
      res.status(error.status).json(error);
    }
  },

  getCourses: async (req, res) => {
    try {
      const { page, limit, name } = req.query;
      const rs = await courseService.getCourses(
        Number(page),
        Number(limit),
        name,
      );
      res.status(rs.status).json(rs);
    } catch (error) {
      logger.error(error.message);
      res.status(error.status).json(error);
    }
  },

  getCourseById: async (req, res) => {
    try {
      const { id } = req.params;
      const rs = await courseService.getCourseById(id);
      res.status(rs.status).json(rs);
    } catch (error) {
      logger.error(error.message);
      res.status(error.status).json(error);
    }
  },

  updateCourse: async (req, res) => {
    try {
      const { id } = req.params;
      const courseData = req.body;
      const rs = await courseService.updateCourse(id, courseData);
      res.status(rs.status).json(rs);
    } catch (error) {
      logger.error(error.message);
      res.status(error.status).json(error);
    }
  },

  deleteCourse: async (req, res) => {
    try {
      const { id } = req.params;
      const rs = await courseService.deleteCourse(id);
      res.status(rs.status).json(rs);
    } catch (error) {
      logger.error(error.message);
      res.status(error.status).json(error);
    }
  },
};

export default courseController;
