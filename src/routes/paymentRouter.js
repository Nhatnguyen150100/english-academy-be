import express from "express";
import paymentController from "../controllers/paymentController";

const paymentRouter = express.Router();

paymentRouter.get("/update-plan", paymentController.updatePlan);

export default paymentRouter;
