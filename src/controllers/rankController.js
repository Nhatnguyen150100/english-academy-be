"use strict";

import logger from "../config/winston";
import rankService from "../services/rankService";

const rankController = {
  getRankings: async (req, res) => {
    try {
      const { page, limit, name } = req.query;
      const rs = await rankService.getRankings(
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
  getUserInfoRank: async (req, res) => {
    try {
      const { id } = req.params;
      const rs = await rankService.getUserRank(id);
      res.status(rs.status).json(rs);
    } catch (error) {
      logger.error(error.message);
      res.status(error.status).json(error);
    }
  },
};

export default rankController;
