"use strict";

import authRouter from "./authRouter";
import courseRouter from "./courseRouter";
import examCompletionRouter from "./examCompletionRouter";
import examRouter from "./examRouter";
import imagesRouter from "./imagesRouter";
import missionDailyRouter from "./missionDailyRouter";

const prefixURL = "/v1";

const buildUrl = (url) => {
  return `${prefixURL}${url}`;
}

const setUpRouters = (app) => {
  app.use(buildUrl("/images"), imagesRouter);
  app.use(buildUrl("/auth"), authRouter);
  app.use(buildUrl("/courses"), courseRouter);
  app.use(buildUrl("/exams"), examRouter);
  app.use(buildUrl("/mission-daily"), missionDailyRouter);
  app.use(buildUrl("/exam-completion"), examCompletionRouter);
}

export default setUpRouters;