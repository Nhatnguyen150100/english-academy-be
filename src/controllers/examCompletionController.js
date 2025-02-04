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
};

export default examCompletionController;
