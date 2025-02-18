"use strict";

import logger from "../config/winston";
import rankService from "../services/rankService";

const rankController = {
  getRankings: async (req, res) => {
    try {
      const rs = await rankService.getRankings(req.query);
      res.status(rs.status).json(rs);
    } catch (error) {
      logger.error(error.message);
      res.status(error.status).json(error);
    }
  },

  getUserRank: async (req, res) => {
    try {
      const userId = req.user._id;
      const rs = await rankService.getUserRank(userId);
      res.status(rs.status).json(rs);
    } catch (error) {
      logger.error(error.message);
      res.status(error.status).json(error);
    }
  },
};

export default rankController;
