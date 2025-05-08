"use strict";
import * as dotenv from "dotenv";

dotenv.config();
import queryString from "qs";
import { BaseErrorResponse, BaseSuccessResponse } from "../config/baseResponse";
import logger from "../config/winston";
import bcryptjs from "bcryptjs";
import dayjs from "dayjs";
import generateSignature from "../utils/generate-signature";
import { User } from "../models/user";
import DEFINE_PLAN from "../constants/plan";

function sortObject(obj) {
  const sorted = {};
  const str = [];

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }

  str.sort();
  for (const key of str) {
    sorted[key] = encodeURIComponent(obj[key]).replace(/%20/g, "+");
  }

  return sorted;
}

const paymentService = {
  createPayment: (user, amount) => {
    return new Promise(async (resolve, reject) => {
      try {
        const secretToken = bcryptjs.hash(process.env.VN_PAY_HASH_KEY, 10);
        const merchantId = process.env.VN_PAY_MERCHANT_ID;
        const hashSecret = process.env.VN_PAY_HASH_SECRET;
        const vnPayUrl = process.env.VN_PAY_URL;
        const date = new Date();
        const createDate = dayjs(date).format("YYYYMMDDHHmmss");

        const vnpParams = {
          vnp_Version: "2.1.0",
          vnp_Command: "pay",
          vnp_TmnCode: merchantId,
          vnp_Amount: amount * 100,
          vnp_CreateDate: createDate,
          vnp_CurrCode: "VND",
          vnp_IpAddr: "127.0.0.1",
          vnp_Locale: "vn",
          vnp_OrderInfo: user._id,
          vnp_OrderType: "billpayment",
          vnp_ReturnUrl: `${process.env.BASE_URL_SERVER_PAYMENT}/v1/payment/update-plan?secretToken=${secretToken}`,
          vnp_TxnRef: dayjs(date).format("DDHHmmss"),
        };

        const sortedKeys = sortObject(vnpParams);
        let signData = queryString.stringify(sortedKeys, { encode: false });
        const signature = generateSignature(signData, hashSecret);
        const paymentUrl = `${vnPayUrl}?${queryString.stringify(sortedKeys, {
          encode: false,
        })}&vnp_SecureHash=${signature}`;

        return resolve(
          new BaseSuccessResponse({
            data: paymentUrl,
            message: "Create payment success",
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
  updatePlan: (userId, amount, secretToken) => {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await User.findById(userId);
        if (!user) {
          return reject(
            new BaseErrorResponse({
              message: "Không tìm thấy người dùng",
            }),
          );
        }
        const validHashKey = bcryptjs.compare(
          secretToken,
          process.env.VN_PAY_HASH_KEY,
        );
        if (!validHashKey) {
          return reject(
            new BaseErrorResponse({
              message: "Mã xác thực không chính xác",
            }),
          );
        }
        const isMonthlyPlan = DEFINE_PLAN.MONTHLY.price === amount;
        const durationInDays = isMonthlyPlan ? 30 : 365;

        const premiumExpiresAt = new Date(
          Date.now() + durationInDays * 24 * 60 * 60 * 1000,
        );
        const userUpdated = await User.findByIdAndUpdate(
          userId,
          {
            accountType: "PREMIUM",
            premiumExpiresAt,
          },
          { new: true },
        );

        return resolve(
          new BaseSuccessResponse({
            data: userUpdated,
            message: "updated success",
          }),
        );
      } catch (error) {}
    });
  },
};

export default paymentService;
