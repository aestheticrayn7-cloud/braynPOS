const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, 'apps/web/.env.local') });

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

async function listModels() {
  try {
    const result = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" }).listModels();
    console.log("Models:", JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("Error listing models:", error);
  }
}

listModels();
