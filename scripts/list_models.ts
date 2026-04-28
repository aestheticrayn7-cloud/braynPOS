import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

async function listModels() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
  try {
    // In the latest SDK, listing models is done via the generative AI service
    // But we can also just try a common name.
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
    const data = await response.json();
    console.log("Available Models:", JSON.stringify(data.models?.map((m: any) => m.name), null, 2));
  } catch (e: any) {
    console.log("Listing failed:", e.message);
  }
}

listModels();
