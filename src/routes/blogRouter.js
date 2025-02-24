"use strict";
import express from "express";
import tokenMiddleware from "../middleware/tokenMiddleware";
import blogController from "../controllers/blogController";

const blogRouter = express.Router();

blogRouter.post("/", tokenMiddleware.verifyToken, blogController.createBlog);
blogRouter.put("/approve-blog", tokenMiddleware.verifyTokenAdmin, blogController.createBlog);
blogRouter.put("/:id", tokenMiddleware.verifyToken, blogController.updateBlog);
blogRouter.get("/", blogController.getAllBlogs);
blogRouter.get("/:id", blogController.getBlogDetail);
blogRouter.get("/by-user", tokenMiddleware.verifyToken, blogController.getBlogsByUser);
blogRouter.delete("/:id", tokenMiddleware.verifyToken, blogController.deleteBlog);

export default blogRouter;