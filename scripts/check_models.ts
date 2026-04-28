import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config(); // Assuming run from apps/api where .env is

async function listModels() {
  console.log("Using API Key:", process.env.GEMINI_API_KEY ? "Set (length " + process.env.GEMINI_API_KEY.length + ")" : "Not Set");
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
  
  const modelsToTest = ["gemini-1.5-flash", "gemini-2.0-flash", "gemini-2.5-flash"];

  for (const m of modelsToTest) {
    try {
      const model = genAI.getGenerativeModel({ model: m });
      const result = await model.generateContent("test");
      console.log(`Model ${m} works!`);
    } catch (e: any) {
      console.log(`Model ${m} failed:`, e.message);
    }
  }
}

listModels();
