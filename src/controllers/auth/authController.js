"use strict";
import logger from "../../config/winston.js";
import authService from "../../services/auth/authService.js";
import tokenService from "../../services/token/tokenService.js";

const authController = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const rs = await authService.login(email, password);
      if (!rs.data) {
        return res.status(rs.status).json({ message: rs.message });
      }
      const accessToken = tokenService.generateToken(rs.data);
      res.status(rs.status).json({
        message: rs.message,
        data: { user: rs.data, accessToken: accessToken },
        status: rs.status,
      });
    } catch (error) {
      logger.error(error.message);
      res.status(error.status).json(error);
    }
  },
  requestToPremium: async (req, res) => {
    try {
      const user = req.user;
      const rs = await authService.requestToPremium(user._id);
      res.status(rs.status).json(rs);
    } catch (error) {
      logger.error(error.message);
      res.status(error.status).json(error);
    }
  },
  register: async (req, res) => {
    try {
      const { email, password } = req.body;
      const rs = await authService.register(email, password);
      res.status(rs.status).json(rs);
    } catch (error) {
      logger.error(error.message);
      res.status(error.status).json(error);
    }
  },
  me: async (req, res) => {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const rs = await authService.me(user.email);
      res.status(rs.status).json(rs);
    } catch (error) {
      logger.error(error.message);
      res.status(error.status).json(error);
    }
  },
  listUser: async (req, res) => {
    try {
      const { page, limit, name, isRequestChangeToPremium } = req.query;
      const rs = await authService.listUser(
        Number(page),
        Number(limit),
        name,
        Boolean(isRequestChangeToPremium),
      );
      res.status(rs.status).json(rs);
    } catch (error) {
      logger.error(error.message);
      res.status(error.status).json(error);
    }
  },
  updateAccountType: async (req, res) => {
    try {
      const { id } = req.params;
      const { accountType } = req.body;
      const rs = await authService.updateAccountType(id, accountType);
      res.status(rs.status).json(rs);
    } catch (error) {
      logger.error(error.message);
      res.status(error.status).json(error);
    }
  },
  getUserInfo: async (req, res) => {
    try {
      const { id } = req.params;
      const rs = await authService.getUserInfo(id);
      res.status(rs.status).json(rs);
    } catch (error) {
      logger.error(error.message);
      res.status(error.status).json(error);
    }
  },
  updateInfo: async (req, res) => {
    try {
      const userId = req.user._id;
      const rs = await authService.updateInfo(userId, req.body);
      res.status(rs.status).json(rs);
    } catch (error) {
      logger.error(error.message);
      res.status(error.status).json(error);
    }
  },
};

export default authController;
