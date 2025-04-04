"use strict";

import logger from "../config/winston";
import chapterService from "../services/chapterService";

const chapterController = {
  createChapter: async (req, res) => {
    try {
      const examData = req.body;
      const rs = await chapterService.createChapter(examData);
      res.status(rs.status).json(rs);
    } catch (error) {
      logger.error(error.message);
      res.status(error.status).json(error);
    }
  },

  getChaptersByCourseId: async (req, res) => {
    try {
      const { id } = req.params;
      const { page, limit } = req.query;
      const rs = await chapterService.getChaptersByCourseId(
        id,
        Number(page) || 1,
        Number(limit) || 5,
      );
      res.status(rs.status).json(rs);
    } catch (error) {
      logger.error(error.message);
      res.status(error.status).json(error);
    }
  },

  getChapterById: async (req, res) => {
    try {
      const { id } = req.params;
      const rs = await chapterService.getChapterById(id);
      res.status(rs.status).json(rs);
    } catch (error) {
      logger.error(error.message);
      res.status(error.status).json(error);
    }
  },

  updateChapter: async (req, res) => {
    try {
      const { id } = req.params;
      const rs = await chapterService.updateChapter(id, req.body);
      res.status(rs.status).json(rs);
    } catch (error) {
      logger.error(error.message);
      res.status(error.status).json(error);
    }
  },

  deleteChapter: async (req, res) => {
    try {
      const { id } = req.params;
      const rs = await chapterService.deleteChapter(id);
      res.status(rs.status).json(rs);
    } catch (error) {
      logger.error(error.message);
      res.status(error.status).json(error);
    }
  },

  reorderChapters: async (req, res) => {
    try {
      const { id } = req.params;
      const rs = await chapterService.reorderChapters(id, req.body);
      res.status(rs.status).json(rs);
    } catch (error) {
      logger.error(error.message);
      res.status(error.status).json(error);
    }
  },
};

export default chapterController;
