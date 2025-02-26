"use strict";

import logger from "../config/winston";
import blogService from "../services/blogService";

const blogController = {
  createBlog: async (req, res) => {
    try {
      const userId = req.user._id;
      const blogData = req.body;
      const rs = await blogService.createBlog(userId, blogData);
      res.status(rs.status).json(rs);
    } catch (error) {
      logger.error(error.message);
      res.status(error.status).json(error);
    }
  },

  updateBlog: async (req, res) => {
    try {
      const blogId = req.params.id;
      const userId = req.user._id;
      const blogData = req.body;
      const rs = await blogService.updateBlog(blogId, userId, blogData);
      res.status(rs.status).json(rs);
    } catch (error) {
      logger.error(error.message);
      res.status(error.status).json(error);
    }
  },

  statusBlog: async (req, res) => {
    try {
      const blogId = req.params.id;
      const rs = await blogService.statusBlog(blogId, req.body);
      res.status(rs.status).json(rs);
    } catch (error) {
      logger.error(error.message);
      res.status(error.status).json(error);
    }
  },

  getAllBlogs: async (req, res) => {
    try {
      const page = parseInt(req.query.page);
      const limit = parseInt(req.query.limit);
      const rs = await blogService.getAllBlogs(page, limit, req.query.search);
      res.status(rs.status).json(rs);
    } catch (error) {
      logger.error(error.message);
      res.status(error.status).json(error);
    }
  },

  getBlogDetail: async (req, res) => {
    try {
      const blogId = req.params.id;
      const rs = await blogService.getBlogDetail(blogId);
      res.status(rs.status).json(rs);
    } catch (error) {
      logger.error(error.message);
      res.status(error.status).json(error);
    }
  },

  getBlogsByUser: async (req, res) => {
    try {
      const userId = req.user._id;
      const page = parseInt(req.query.page);
      const limit = parseInt(req.query.limit);
      const rs = await blogService.getBlogsByUser(
        userId,
        page,
        limit,
        req.query.search,
      );
      res.status(rs.status).json(rs);
    } catch (error) {
      logger.error(error.message);
      res.status(error.status).json(error);
    }
  },

  deleteBlog: async (req, res) => {
    try {
      const blogId = req.params.id;
      const userId = req.user._id;
      const rs = await blogService.deleteBlog(blogId, userId);
      res.status(rs.status).json(rs);
    } catch (error) {
      logger.error(error.message);
      res.status(error.status).json(error);
    }
  },
};

export default blogController;
