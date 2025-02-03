"use strict";

import authRouter from "./authRouter";
import courseRouter from "./courseRouter";
import examRouter from "./examRouter";
import imagesRouter from "./imagesRouter";

const prefixURL = "/v1";

const setUpRouters = (app) => {
  app.use(`${prefixURL}/images`, imagesRouter);
  app.use(`${prefixURL}/auth`, authRouter);
  app.use(`${prefixURL}/courses`, courseRouter);
  app.use(`${prefixURL}/exams`, examRouter);
}

export default setUpRouters;