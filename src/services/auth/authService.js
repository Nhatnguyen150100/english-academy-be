"use strict";
import logger from "../../config/winston.js";
import {
  BaseErrorResponse,
  BaseSuccessResponse,
} from "../../config/baseResponse.js";
import generateRandomPassword from "../../utils/generate-password.js";
import { User } from "../../models/user.js";

const authService = {
  login: (email, password) => {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          return resolve(
            new BaseErrorResponse({
              message: "Account not found. Please try again",
            }),
          );
        }
        const validPassword = await user.isValidPassword(password);
        if (!validPassword) {
          return resolve(
            new BaseErrorResponse({
              message: "Password is not valid. Please try again",
            }),
          );
        } else {
          delete user._doc.password;
          return resolve(
            new BaseSuccessResponse({
              data: user._doc,
              message: "Login successfully",
            }),
          );
        }
      } catch (error) {
        logger.error(error.message);
        reject(
          new BaseErrorResponse({
            message: error.message,
          }),
        );
      }
    });
  },
  loginByGoogle: (email, name) => {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          const randomPassword = generateRandomPassword(8);
          const newUser = new User({ email, password: randomPassword, name });
          await newUser.save();
          const rs = newUser.toObject();
          delete rs.password;
          return resolve(
            new BaseSuccessResponse({
              data: rs,
              message: "Đăng nhập thành công",
            }),
          );
        }
        delete user._doc.password;
        return resolve(
          new BaseSuccessResponse({
            data: user._doc,
            message: "Đăng nhập thành công",
          }),
        );
      } catch (error) {
        logger.error(error.message);
        reject(
          new BaseErrorResponse({
            message: error.message,
          }),
        );
      }
    });
  },
  register: (email, password) => {
    return new Promise(async (resolve, reject) => {
      try {
        const user = new User({ email, password });
        await user.save();
        const rs = user.toObject();
        delete rs.password;
        return resolve(
          new BaseSuccessResponse({
            data: rs,
            message: "Registration successfully",
          }),
        );
      } catch (error) {
        logger.error(error.parent);
        reject(
          new BaseErrorResponse({
            message: error.message,
          }),
        );
      }
    });
  },
  checkUserExists: (email) => {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await User.findOne({ email });
        if (user) {
          return resolve(
            new BaseSuccessResponse({
              data: true,
              message: "Email is already exists",
            }),
          );
        } else {
          return resolve(
            new BaseSuccessResponse({
              data: false,
              message: "Email is not available",
            }),
          );
        }
      } catch (error) {
        logger.error(error.message);
        reject(
          new BaseErrorResponse({
            message: error.message,
          }),
        );
      }
    });
  },
  me: (email) => {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          return resolve(
            new BaseErrorResponse({
              message: "User not found",
            }),
          );
        }
        delete user._doc.password;
        return resolve(
          new BaseSuccessResponse({
            data: user._doc,
            message: "Get user successfully",
          }),
        );
      } catch (error) {
        logger.error(error.message);
        reject(
          new BaseErrorResponse({
            message: error.message,
          }),
        );
      }
    });
  },
  updateInfo: (userId, data) => {
    return new Promise(async (resolve, reject) => {
      try {
        const { name, phoneNumber, address } = data;
        const user = await User.findByIdAndUpdate(
          userId,
          { name, phone_number: phoneNumber, address },
          { new: true },
        );
        if (!user) {
          return resolve(
            new BaseErrorResponse({
              message: "User not found",
            }),
          );
        }
        delete user._doc.password;
        return resolve(
          new BaseSuccessResponse({
            data: user._doc,
            message: "Update user information successfully",
          }),
        );
      } catch (error) {
        logger.error(error.message);
        reject(
          new BaseErrorResponse({
            message: error.message,
          }),
        );
      }
    });
  },
  getUserInfo: (userId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await User.findById(userId);
        if (!user) {
          return resolve(
            new BaseErrorResponse({
              message: "User not found",
            }),
          );
        }
        delete user._doc.password;
        return resolve(
          new BaseSuccessResponse({
            data: user._doc,
            message: "Get user information successfully",
          }),
        );
      } catch (error) {
        logger.error(error.message);
        reject(
          new BaseErrorResponse({
            message: error.message,
          }),
        );
      }
    });
  },
  listUser: (page = 1, limit = 10, name = "") => {
    return new Promise(async (resolve, reject) => {
      try {
        const query = name
          ? { name: { $regex: name, $options: "i" }, role: "USER" }
          : { role: "USER" };
        const users = await User.find(query)
          .skip((page - 1) * limit)
          .limit(limit);
        const totalUsers = await User.countDocuments(query);
        return resolve(
          new BaseSuccessResponse({
            data: {
              data: users,
              page,
              total: totalUsers,
              totalPages: Math.ceil(totalUsers / limit),
            },
            message: "List users successfully",
          }),
        );
      } catch (error) {
        logger.error(error.message);
        reject(
          new BaseErrorResponse({
            message: error.message,
          }),
        );
      }
    });
  },
  updateAccountType: (userId, accountType) => {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await User.findByIdAndUpdate(userId, {
          accountType,
        });
        if (!user) {
          return resolve(
            new BaseErrorResponse({
              message: "User not found",
            }),
          );
        }
        delete user._doc.password;
        return resolve(
          new BaseSuccessResponse({
            data: user._doc,
            message: "Update account type successfully",
          }),
        );
      } catch (error) {
        logger.error(error.message);
        reject(
          new BaseErrorResponse({
            message: error.message,
          }),
        );
      }
    });
  },
};

export default authService;
