"use strict";
import express from "express";
import tokenMiddleware from "../middleware/tokenMiddleware";
import examController from "../controllers/examController";
const examRouter = express.Router();

examRouter.post(
  "/",
  tokenMiddleware.verifyTokenAdmin,
  examController.createExam,
);
examRouter.get("/", tokenMiddleware.verifyToken, examController.getExams);
examRouter.get(
  "/list-exam-in-chapter/:id",
  tokenMiddleware.verifyToken,
  examController.getExamsByChapterId,
);
examRouter.get("/:id", tokenMiddleware.verifyToken, examController.getExamById);
examRouter.put(
  "/:id",
  tokenMiddleware.verifyTokenAdmin,
  examController.updateExam,
);
examRouter.delete(
  "/:id",
  tokenMiddleware.verifyTokenAdmin,
  examController.deleteExam,
);

export default examRouter;
