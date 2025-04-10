import { BaseSuccessResponse } from "../config/baseResponse";
import logger from "../config/winston";
import genAI from "../constants/gemini-ai";
import generatePrompt from "../constants/systemPrompt";

const chatBotService = {
  async analyzeQuery(userMessage) {
    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-pro-latest",
      });

      const messageRequest = generatePrompt(userMessage);

      const result = await model.generateContent(messageRequest);
      const response = result.response;
      return response.text();
    } catch (error) {
      console.log("🚀 ~ analyzeQuery ~ error:", error);
      logger.error(`Error analyzing query: ${error.message}`);
      throw new Error("Failed to analyze query");
    }
  },
  async handleUserMessage(userMessage) {
    try {
      const res = await this.analyzeQuery(userMessage);
      return new BaseSuccessResponse({
        data: res,
        message: "Send message success",
      });
    } catch (error) {
      logger.error(`Error analyzing query: ${error.message}`);
      throw new Error("Failed to analyze query");
    }
  },
};

export default chatBotService;
