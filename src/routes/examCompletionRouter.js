"use strict";
import express from "express";
import tokenMiddleware from "../middleware/tokenMiddleware";
import examCompletionController from "../controllers/examCompletionController";

const examCompletionRouter = express.Router();

examCompletionRouter.post("/submit", tokenMiddleware.verifyToken, examCompletionController.submitExam);

export default examCompletionRouter;