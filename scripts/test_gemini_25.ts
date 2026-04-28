import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

async function test25() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent("Hello, are you operational?");
    console.log("Gemini 2.5 Response:", result.response.text());
  } catch (e: any) {
    console.log("Gemini 2.5 failed:", e.message);
  }
}

test25();
