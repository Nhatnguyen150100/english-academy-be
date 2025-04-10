import express from "express";
import chatbotController from "../controllers/chatbotController";
import tokenMiddleware from "../middleware/tokenMiddleware";

const chatbotRouter = express.Router();

chatbotRouter.post(
  "/",
  tokenMiddleware.verifyToken,
  chatbotController.handleUserMessage,
);

export default chatbotRouter;
