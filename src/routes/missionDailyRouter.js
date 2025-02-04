"use strict";
import express from "express";
import tokenMiddleware from "../middleware/tokenMiddleware";
import missionDailyController from "../controllers/missionDailyController";

const missionDailyRouter = express.Router();

missionDailyRouter.get("/", tokenMiddleware.verifyToken, missionDailyController.getMissionDaily);
missionDailyRouter.post("/", tokenMiddleware.verifyToken, missionDailyController.createMissionDaily);
missionDailyRouter.post("/confirm/:id", tokenMiddleware.verifyToken, missionDailyController.confirmMissionDaily);

export default missionDailyRouter;