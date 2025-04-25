"use strict";
import express from "express";
import tokenMiddleware from "../middleware/tokenMiddleware";
import blogController from "../controllers/blogController";

const blogRouter = express.Router();

blogRouter.get("/", blogController.getAllBlogs);
blogRouter.get(
  "/by-user",
  tokenMiddleware.verifyToken,
  blogController.getBlogsByUser,
);
blogRouter.get(
  "/by-admin",
  tokenMiddleware.verifyToken,
  blogController.getBlogsByAdmin,
);
blogRouter.get("/:id", blogController.getBlogDetail);
blogRouter.post("/", tokenMiddleware.verifyToken, blogController.createBlog);
blogRouter.put(
  "/status-blog/:id",
  tokenMiddleware.verifyTokenAdmin,
  blogController.statusBlog,
);
blogRouter.put("/:id", tokenMiddleware.verifyToken, blogController.updateBlog);
blogRouter.delete(
  "/:id",
  tokenMiddleware.verifyToken,
  blogController.deleteBlog,
);

blogRouter.post(
  "/:id/like",
  tokenMiddleware.verifyToken,
  blogController.likeBlog,
);

blogRouter.post(
  "/:id/comment",
  tokenMiddleware.verifyToken,
  blogController.commentBlog,
);

export default blogRouter;
