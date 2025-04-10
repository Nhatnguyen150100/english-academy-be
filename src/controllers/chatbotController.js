import chatBotService from "../services/chatBotService";

const chatbotController = {
  handleUserMessage: async (req, res) => {
    try {
      const rs = await chatBotService.handleUserMessage(req.body.message);
      res.status(rs.status).json(rs);
    } catch (error) {
      res.status(error.status || 500).json(error);
    }
  },
};

export default chatbotController;
