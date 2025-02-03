"use strict";

import logger from "../config/winston";
import sourceService from "../services/sourceService";

const courseController = {
  createCourse: async (req, res) => {
    try {
      const courseData = req.body;
      const rs = await sourceService.createCourse(courseData);
      res.status(rs.status).json(rs);
    } catch (error) {
      logger.error(error.message);
      res.status(error.status).json(error);
    }
  },

  getCourses: async (req, res) => {
    try {
      const { page, limit, searchTerm } = req.query;
      const rs = await sourceService.getCourses(
        Number(page),
        Number(limit),
        searchTerm,
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
      const rs = await sourceService.getCourseById(id);
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
      const rs = await sourceService.updateCourse(id, courseData);
      res.status(rs.status).json(rs);
    } catch (error) {
      logger.error(error.message);
      res.status(error.status).json(error);
    }
  },

  deleteCourse: async (req, res) => {
    try {
      const { id } = req.params;
      const rs = await sourceService.deleteCourse(id);
      res.status(rs.status).json(rs);
    } catch (error) {
      logger.error(error.message);
      res.status(error.status).json(error);
    }
  },
};

export default courseController;
