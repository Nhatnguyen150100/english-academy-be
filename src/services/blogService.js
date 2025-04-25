"use strict";
import {
  BaseErrorResponse,
  BaseSuccessResponse,
} from "../config/baseResponse.js";
import logger from "../config/winston.js";
import { Blog } from "../models/blog.js";
import { User } from "../models/user.js";

const blogService = {
  createBlog: async (userId, data) => {
    try {
      const { title, thumbnail, description, content } = data;
      const blog = new Blog({ userId, title, thumbnail, description, content });
      const savedBlog = await blog.save();
      return new BaseSuccessResponse({
        data: savedBlog,
        message: "Blog created successfully",
      });
    } catch (error) {
      logger.error(error.message);
      throw new BaseErrorResponse({
        message: error.message,
      });
    }
  },

  updateBlog: async (id, userId, data) => {
    try {
      const { title, thumbnail, description, content } = data;
      const blog = await Blog.findById(id);
      if (!blog) {
        return new BaseErrorResponse({
          message: "Blog not found",
        });
      }
      if (blog.userId.toString() !== userId) {
        return new BaseErrorResponse({
          message: "Unauthorized to update this blog",
        });
      }
      const updatedBlog = await Blog.findByIdAndUpdate(id, {
        title,
        thumbnail,
        description,
        content,
      });
      return new BaseSuccessResponse({
        data: updatedBlog,
        message: "Blog updated successfully",
      });
    } catch (error) {
      logger.error(error.message);
      throw new BaseErrorResponse({
        message: error.message,
      });
    }
  },

  statusBlog: async (id, data) => {
    try {
      const { status } = data;
      if (!["APPROVED", "REJECTED"].includes(status)) {
        return new BaseErrorResponse({
          message:
            "Invalid status. Only 'APPROVED' and 'REJECTED' are allowed.",
        });
      }
      const blog = await Blog.findById(id);
      if (!blog) {
        return new BaseErrorResponse({
          message: "Blog not found",
        });
      }
      blog.statusBlog = status;
      await blog.save();
      return new BaseSuccessResponse({
        data: blog,
        message: "Blog status updated successfully",
      });
    } catch (error) {
      logger.error(error.message);
      throw new BaseErrorResponse({
        message: error.message,
      });
    }
  },

  getAllBlogs: async (page = 1, limit = 10, search = "") => {
    try {
      const query = search
        ? {
            title: { $regex: search, $options: "i" },
            statusBlog: "APPROVED",
          }
        : { statusBlog: "APPROVED" };
      const blogs = await Blog.find(query)
        .select("-content")
        .skip((page - 1) * limit)
        .limit(limit);

      const totalBlogs = await Blog.countDocuments(query);

      return new BaseSuccessResponse({
        data: {
          data: blogs,
          total: totalBlogs,
          page,
          totalPages: Math.ceil(totalBlogs / limit) ?? 1,
        },
        message: "Fetched blogs successfully",
      });
    } catch (error) {
      logger.error(error.message);
      throw new BaseErrorResponse({
        message: error.message,
      });
    }
  },

  getBlogDetail: async (id) => {
    try {
      const blog = await Blog.findById(id).populate("userId").populate({
        path: "comments.userId",
        model: "User",
      });
      if (!blog) {
        return new BaseErrorResponse({
          message: "Blog not found",
        });
      }

      return new BaseSuccessResponse({
        data: blog,
        message: "Fetched blog successfully",
      });
    } catch (error) {
      logger.error(error.message);
      throw new BaseErrorResponse({
        message: error.message,
      });
    }
  },

  getBlogsByUser: async (userId, page = 1, limit = 10, search = "") => {
    try {
      const query = search
        ? { title: { $regex: search, $options: "i" }, userId }
        : { userId };
      const blogs = await Blog.find(query)
        .select("-content")
        .skip((page - 1) * limit)
        .limit(limit);

      const totalBlogs = await Blog.countDocuments(query);

      return new BaseSuccessResponse({
        data: {
          data: blogs,
          total: totalBlogs,
          page,
          totalPages: Math.ceil(totalBlogs / limit) ?? 1,
        },
        message: "Fetched blogs successfully",
      });
    } catch (error) {
      logger.error(error.message);
      throw new BaseErrorResponse({
        message: error.message,
      });
    }
  },

  getBlogsByAdmin: async (page = 1, limit = 10, search = "") => {
    try {
      const query = search ? { title: { $regex: search, $options: "i" } } : {};
      const blogs = await Blog.find(query)
        .select("-content")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

      const totalBlogs = await Blog.countDocuments(query);

      return new BaseSuccessResponse({
        data: {
          data: blogs,
          total: totalBlogs,
          page,
          totalPages: Math.ceil(totalBlogs / limit) ?? 1,
        },
        message: "Fetched blogs successfully",
      });
    } catch (error) {
      logger.error(error.message);
      throw new BaseErrorResponse({
        message: error.message,
      });
    }
  },

  deleteBlog: async (id, userId) => {
    try {
      const user = User.findById(userId);
      const blog = await Blog.findById(id);
      if (!blog) {
        return new BaseErrorResponse({
          message: "Blog not found",
        });
      }
      if (blog.userId !== userId && user.role === "USER") {
        return new BaseErrorResponse({
          message: "Unauthorized to delete this blog",
        });
      }
      await blog.deleteOne();
      return new BaseSuccessResponse({
        message: "Blog deleted successfully",
      });
    } catch (error) {
      logger.error(error.message);
      throw new BaseErrorResponse({
        message: error.message,
      });
    }
  },

  likeBlog: async (blogId, userId) => {
    try {
      const blog = await Blog.findById(blogId);
      if (!blog) {
        return new BaseErrorResponse({ message: "Blog not found" });
      }

      const index = blog.likes.indexOf(userId);
      if (index !== -1) {
        blog.likes.splice(index, 1);
        await blog.save();
        return new BaseSuccessResponse({
          data: blog,
          message: "Unliked blog successfully",
        });
      }

      blog.likes.push(userId);
      await blog.save();
      return new BaseSuccessResponse({
        data: blog,
        message: "Liked blog successfully",
      });
    } catch (error) {
      logger.error(error.message);
      throw new BaseErrorResponse({ message: error.message });
    }
  },

  commentBlog: async (blogId, userId, commentText) => {
    try {
      const blog = await Blog.findById(blogId);
      if (!blog) {
        return new BaseErrorResponse({ message: "Blog not found" });
      }

      const comment = {
        userId,
        commentText,
        createdAt: new Date(),
      };

      blog.comments.push(comment);
      await blog.save();

      return new BaseSuccessResponse({
        data: blog,
        message: "Comment added successfully",
      });
    } catch (error) {
      logger.error(error.message);
      throw new BaseErrorResponse({ message: error.message });
    }
  },
};

export default blogService;
