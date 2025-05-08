"use strict";

import paymentService from "../services/paymentService";

const paymentController = {
  updatePlan: async (req, res) => {
    try {
      const { vnp_OrderInfo, vnp_TransactionStatus, vnp_Amount, secretToken } =
        req.query;
      if (vnp_TransactionStatus === "00") {
        await paymentService.updatePlan(
          vnp_OrderInfo,
          vnp_Amount / 100,
          secretToken,
        );
        res.redirect(
          `${process.env.BASE_URL_CLIENT}/payment-success?vnp_ResponseCode=00`,
        );
      } else {
        res.redirect(
          `${process.env.BASE_URL_CLIENT}/payment-error?vnp_ResponseCode=`,
        );
      }
    } catch (error) {
      res.status(error.status).json(error.message);
    }
  },
};

export default paymentController;
