"use strict";

import authRouter from "./authRouter";
import blogRouter from "./blogRouter";
import chapterRouter from "./chapterRouter";
import chatbotRouter from "./chatbotRouter";
import courseRouter from "./courseRouter";
import examCompletionRouter from "./examCompletionRouter";
import examRouter from "./examRouter";
import imagesRouter from "./imagesRouter";
import missionDailyRouter from "./missionDailyRouter";
import paymentRouter from "./paymentRouter";
import rankRouter from "./rankRouter";

const prefixURL = "/v1";

const buildUrl = (url) => {
  return `${prefixURL}${url}`;
};

const setUpRouters = (app) => {
  app.use(buildUrl("/images"), imagesRouter);
  app.use(buildUrl("/auth"), authRouter);
  app.use(buildUrl("/courses"), courseRouter);
  app.use(buildUrl("/exams"), examRouter);
  app.use(buildUrl("/mission-daily"), missionDailyRouter);
  app.use(buildUrl("/exam-completion"), examCompletionRouter);
  app.use(buildUrl("/rank"), rankRouter);
  app.use(buildUrl("/blogs"), blogRouter);
  app.use(buildUrl("/chapter"), chapterRouter);
  app.use(buildUrl("/chat"), chatbotRouter);
  app.use(buildUrl("/payment"), paymentRouter);
};

export default setUpRouters;
