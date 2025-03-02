"use strict";

import logger from "../config/winston";
import examService from "../services/examService";

const examController = {
  createExam: async (req, res) => {
    try {
      const examData = req.body;
      const rs = await examService.createExam(examData);
      res.status(rs.status).json(rs);
    } catch (error) {
      logger.error(error.message);
      res.status(error.status).json(error);
    }
  },

  getExams: async (req, res) => {
    try {
      const { page, limit, name } = req.query;
      const rs = await examService.getExams(
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

  getExamsByCourseId: async (req, res) => {
    try {
      const { id } = req.params;
      const { page, limit, name } = req.query;
      const rs = await examService.getExamsByCourseId(
        id,
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

  getExamById: async (req, res) => {
    try {
      const { id } = req.params;
      const user = req.user;
      const isAdmin = user.role === "ADMIN";
      const rs = await examService.getExamById(user._id, id, isAdmin);
      res.status(rs.status).json(rs);
    } catch (error) {
      logger.error(error.message);
      res.status(error.status).json(error);
    }
  },

  updateExam: async (req, res) => {
    try {
      const { id } = req.params;
      const examData = req.body;
      const rs = await examService.updateExam(id, examData);
      res.status(rs.status).json(rs);
    } catch (error) {
      logger.error(error.message);
      res.status(error.status).json(error);
    }
  },

  deleteExam: async (req, res) => {
    try {
      const { id } = req.params;
      const rs = await examService.deleteExam(id);
      res.status(rs.status).json(rs);
    } catch (error) {
      logger.error(error.message);
      res.status(error.status).json(error);
    }
  },
};

export default examController;
