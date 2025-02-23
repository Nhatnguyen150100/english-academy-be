"use strict";

import logger from "../config/winston";
import examCompletionService from "../services/examCompletionService";

const examCompletionController = {
  submitExam: async (req, res) => {
    try {
      const userId = req.user._id;
      const { examId, listAnswer } = req.body;
      const rs = await examCompletionService.submitExam(
        userId,
        examId,
        listAnswer,
      );
      res.status(rs.status).json(rs);
    } catch (error) {
      logger.error(error.message);
      res.status(error.status).json(error);
    }
  },
  checkNumberExamAttempt: async (req, res) => {
    try {
      const userId = req.user._id;
      const rs = await examCompletionService.checkNumberExamAttempt(userId);
      res.status(rs.status).json(rs);
    } catch (error) {
      logger.error(error.message);
      res.status(error.status).json(error);
    }
  },
  getHistory: async (req, res) => {
    try {
      const userId = req.user._id;
      const { page, limit } = req.query;
      const rs = await examCompletionService.getHistory(userId, page, limit);
      res.status(rs.status).json(rs);
    } catch (error) {
      logger.error(error.message);
      res.status(error.status).json(error);
    }
  },
};

export default examCompletionController;
