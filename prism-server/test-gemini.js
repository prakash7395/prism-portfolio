
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    timeout: 30000,
  },
});

console.log("Testing Gemini connection...");

try {
  const start = Date.now();

  const response = await ai.models.generateContent({
    model: "gemini-3.8-flash",
    contents: "Reply with only: Hello Prakash!",
    config: {
      maxOutputTokens: 30,
    },
  });

  console.log("Gemini reply:", response.text);
  console.log("Time taken:", Date.now() - start, "ms");

} catch (error) {
  console.error("Gemini test failed:");
  console.error("Message:", error.message);
  console.error("Status:", error.status || error.code);
}
