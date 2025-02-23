"use strict";
import express from "express";
import tokenMiddleware from "../middleware/tokenMiddleware";
import examCompletionController from "../controllers/examCompletionController";

const examCompletionRouter = express.Router();

examCompletionRouter.post("/submit", tokenMiddleware.verifyToken, examCompletionController.submitExam);
examCompletionRouter.get("/exam-attempt", tokenMiddleware.verifyToken, examCompletionController.checkNumberExamAttempt);
examCompletionRouter.get("/history", tokenMiddleware.verifyToken, examCompletionController.getHistory);

export default examCompletionRouter;