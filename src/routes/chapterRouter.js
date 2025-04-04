"use strict";
import express from "express";
import tokenMiddleware from "../middleware/tokenMiddleware";
import chapterController from "../controllers/chapterController";
const chapterRouter = express.Router();

chapterRouter.post(
  "/",
  tokenMiddleware.verifyTokenAdmin,
  chapterController.createChapter,
);
chapterRouter.get(
  "/:id",
  tokenMiddleware.verifyToken,
  chapterController.getChaptersByCourseId,
);
chapterRouter.get(
  "/detail/:id",
  tokenMiddleware.verifyToken,
  chapterController.getChapterById,
);
chapterRouter.put(
  "/:id",
  tokenMiddleware.verifyTokenAdmin,
  chapterController.updateChapter,
);
chapterRouter.put(
  "/reorder/:id",
  tokenMiddleware.verifyTokenAdmin,
  chapterController.reorderChapters,
);
chapterRouter.delete(
  "/:id",
  tokenMiddleware.verifyTokenAdmin,
  chapterController.deleteChapter,
);

export default chapterRouter;
