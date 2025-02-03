"use strict";
import express from "express";
import courseController from "../controllers/courseController";
import tokenMiddleware from "../middleware/tokenMiddleware";
const courseRouter = express.Router();

courseRouter.post("/", tokenMiddleware.verifyTokenAdmin, courseController.createCourse);
courseRouter.get("/", tokenMiddleware.verifyToken,courseController.getCourses);
courseRouter.get("/:id", tokenMiddleware.verifyToken,courseController.getCourseById);
courseRouter.put("/:id", tokenMiddleware.verifyTokenAdmin, courseController.updateCourse);
courseRouter.delete("/:id", tokenMiddleware.verifyTokenAdmin, courseController.deleteCourse);

export default courseRouter;