"use strict";

import express from "express";
import tokenMiddleware from "../middleware/tokenMiddleware";
import rankController from "../controllers/rankController";

const rankRouter = express.Router();

rankRouter.get("/", tokenMiddleware.verifyToken, rankController.getRankings);
rankRouter.get(
  "/my-rank",
  tokenMiddleware.verifyToken,
  rankController.getUserRank,
);

export default rankRouter;
