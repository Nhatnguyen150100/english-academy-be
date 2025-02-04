"use strict";

import logger from "../config/winston";
import missionDailyService from "../services/missionDailyService";

const missionDailyController = {
  getMissionDaily: async (req, res) => {
    try {
      const userId = req.user._id;
      const rs = await missionDailyService.getMissionDaily(userId);
      res.status(rs.status).json(rs);
    } catch (error) {
      logger.error(error.message);
      res.status(error.status).json(error);
    }
  },

  createMissionDaily: async (req, res) => {
    try {
      const userId = req.user._id;
      const rs = await missionDailyService.createMissionDaily(userId);
      res.status(rs.status).json(rs);
    } catch (error) {
      logger.error(error.message);
      res.status(error.status).json(error);
    }
  },

  confirmMissionDaily: async (req, res) => {
    try {
      const { id } = req.params;
      const rs = await missionDailyService.confirmMissionDaily(id);
      res.status(rs.status).json(rs);
    } catch (error) {
      logger.error(error.message);
      res.status(error.status).json(error);
    }
  },
};

export default missionDailyController;
