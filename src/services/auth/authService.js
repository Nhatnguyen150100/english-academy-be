"use strict";
import logger from "../../config/winston.js";
import {
  BaseErrorResponse,
  BaseSuccessResponse,
} from "../../config/baseResponse.js";
import generateRandomPassword from "../../utils/generate-password.js";
import { User } from "../../models/user.js";
import redisClient from "../../config/redisClient.js";
import mailerServices from "../mailerServices.js";
import mailConfig from "../../config/mail.config.js";
import { OAuth2Client } from "google-auth-library";
import { CLIENT_ID, CLIENT_SECRET } from "../../config/google-keys.js";
import paymentService from "../paymentService.js";
import DEFINE_PLAN from "../../constants/plan.js";
import { Statistics } from "../../models/statistic.js";
import dayjs from "dayjs";
const { hash } = require("bcryptjs");

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
  requestToPremium: (userId, plan) => {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await User.findByIdAndUpdate(userId, {
          isRequestChangeToPremium: true,
        });
        const rs = await paymentService.createPayment(
          user,
          plan === "MONTHLY"
            ? DEFINE_PLAN.MONTHLY.price
            : DEFINE_PLAN.YEARLY.price,
        );
        return resolve(rs);
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
              message: "Login successfully",
            }),
          );
        }
        delete user._doc.password;
        return resolve(
          new BaseSuccessResponse({
            data: user._doc,
            message: "Login successfully",
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
  onCheckAccessTokenGoogle: (idToken) => {
    return new Promise(async (resolve, reject) => {
      try {
        const googleClient = new OAuth2Client(CLIENT_ID, CLIENT_SECRET);
        const ticket = await googleClient.verifyIdToken({
          idToken,
          audience: CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const { email, name } = payload;
        const rs = await authService.loginByGoogle(email, name);
        return resolve(rs);
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
        const checkEmail = await User.findOne({ email });
        if (checkEmail) {
          return resolve(
            new BaseErrorResponse({
              message: "Account already exists. Please try again",
            }),
          );
        }
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
  listUser: (page = 1, limit = 10, name = "", isRequestChangeToPremium) => {
    return new Promise(async (resolve, reject) => {
      try {
        const query = {
          role: "USER",
          ...(name && { name: { $regex: name, $options: "i" } }),
        };

        if (isRequestChangeToPremium === true) {
          query.isRequestChangeToPremium = true;
        }

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
  statistic: (type = "daily") => {
    return new Promise(async (resolve, reject) => {
      try {
        let data = [];
        let message = "";
        let totalAmount = 0;

        if (type === "daily") {
          const start = dayjs().startOf("month").format("YYYY-MM-DD");
          const end = dayjs().endOf("month").format("YYYY-MM-DD");

          const stats = await Statistics.find({
            date: { $gte: start, $lte: end },
          }).sort({ date: 1 });

          data = stats.map((s) => ({
            date: s.date,
            totalAmount: s.totalAmount,
          }));
          message = "Thống kê doanh thu theo ngày trong tháng hiện tại";
        } else if (type === "monthly") {
          const currentYear = dayjs().year();
          const regex = new RegExp(`^${currentYear}-\\d{2}-\\d{2}$`);
          const stats = await Statistics.find({ date: { $regex: regex } });

          const monthMap = {};

          stats.forEach((stat) => {
            const month = dayjs(stat.date).format("YYYY-MM");
            if (!monthMap[month]) monthMap[month] = 0;
            monthMap[month] += stat.totalAmount;
          });

          data = Object.keys(monthMap)
            .map((month) => ({
              date: month,
              totalAmount: monthMap[month],
            }))
            .sort((a, b) => a.date.localeCompare(b.date));

          message = "Thống kê doanh thu theo tháng trong năm hiện tại";
        } else if (type === "yearly") {
          const stats = await Statistics.find();
          const yearMap = {};

          stats.forEach((stat) => {
            const year = dayjs(stat.date).format("YYYY");
            if (!yearMap[year]) yearMap[year] = 0;
            yearMap[year] += stat.totalAmount;
          });

          data = Object.keys(yearMap)
            .map((year) => ({
              date: year,
              totalAmount: yearMap[year],
            }))
            .sort((a, b) => a.date.localeCompare(b.date));

          message = "Thống kê doanh thu theo từng năm";
        }

        totalAmount = data.reduce((sum, item) => sum + item.totalAmount, 0);

        return resolve(
          new BaseSuccessResponse({
            data: {
              type,
              totalAmount,
              stats: data,
            },
            message,
          }),
        );
      } catch (error) {
        logger.error(error.message);
        return reject(
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
        const data = {
          accountType,
          isRequestChangeToPremium: false,
        };
        const user = await User.findByIdAndUpdate(userId, data);
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
  changePassword: (userId, oldPassword, newPassword) => {
    return new Promise(async (resolve, reject) => {
      try {
        if (!oldPassword || !newPassword) {
          return resolve(
            new BaseErrorResponse({
              message: "Old and new password are required",
            }),
          );
        }
        if (oldPassword === newPassword) {
          return resolve(
            new BaseErrorResponse({
              message: "New password must be different from old password",
            }),
          );
        }
        const user = await User.findById(userId);
        if (!user) {
          return resolve(
            new BaseErrorResponse({
              message: "User not found",
            }),
          );
        }

        const isValid = await user.isValidPassword(oldPassword);
        if (!isValid) {
          return resolve(
            new BaseErrorResponse({
              message: "Old password is incorrect",
            }),
          );
        }

        user.password = newPassword;
        await user.save();

        return resolve(
          new BaseSuccessResponse({
            message: "Password changed successfully",
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
  forgotPassword: (email) => {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          return resolve(new BaseErrorResponse({ message: "Email not found" }));
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        await redisClient.set(`otp:${email}`, otp, "EX", 180);

        await mailerServices.sendMail(email, mailConfig.HTML_CONTENT_OTP(otp));

        return resolve(
          new BaseSuccessResponse({
            message: "OTP was sent to your email. Please check your email.",
          }),
        );
      } catch (error) {
        logger.error(error.message);
        reject(new BaseErrorResponse({ message: error.message }));
      }
    });
  },
  verifyOtpAndResetPassword: (email, otp) => {
    return new Promise(async (resolve, reject) => {
      try {
        const storedOtp = await redisClient.get(`otp:${email}`);
        if (!storedOtp || storedOtp !== otp) {
          return resolve(
            new BaseErrorResponse({ message: "Invalid or expired OTP" }),
          );
        }

        const user = await User.findOne({ email });
        if (!user) {
          return resolve(new BaseErrorResponse({ message: "User not found" }));
        }

        const newPassword = generateRandomPassword(10);
        const hashPassword = await hash(newPassword, 10);
        await User.findByIdAndUpdate(user._id, { password: hashPassword });
        await redisClient.del(`otp:${email}`);

        await mailerServices.sendMail(
          email,
          mailConfig.HTML_CONTENT_PASSWORD(newPassword),
        );

        return resolve(
          new BaseSuccessResponse({
            message: "Password reset successfully. Check your email.",
          }),
        );
      } catch (error) {
        logger.error(error.message);
        reject(new BaseErrorResponse({ message: error.message }));
      }
    });
  },
};

export default authService;
