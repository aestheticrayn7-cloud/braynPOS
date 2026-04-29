import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

/**
 * Text Generation (replacing Ollama/Anthropic)
 */
export async function generateText(prompt: string, systemInstruction?: string) {
  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    systemInstruction: systemInstruction 
  });

  const finalPrompt = systemInstruction 
    ? `${systemInstruction}\n\nUser Message: ${prompt}`
    : prompt;

  console.log(`[GEMINI] Generating text (Prompt length: ${finalPrompt.length})`);
  const result = await model.generateContent(finalPrompt);
  const response = await result.response;
  return response.text();
}

/**
 * Streaming Text Generation
 */
export async function* streamText(prompt: string, systemInstruction?: string) {
  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    systemInstruction: systemInstruction 
  });

  // Seamless injection: Prepend to the actual message to ensure priority
  const finalPrompt = systemInstruction 
    ? `${systemInstruction}\n\nUser Message: ${prompt}`
    : prompt;

  const result = await model.generateContentStream(finalPrompt);
  for await (const chunk of result.stream) {
    const chunkText = chunk.text();
    if (chunkText) yield chunkText;
  }
}

/**
 * Text Embeddings (replacing Ollama nomic-embed-text)
 */
export async function embedText(text: string): Promise<number[]> {
  const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
  const result = await model.embedContent(text);
  return result.embedding.values;
}

/**
 * Start a Chat Session
 */
export function createChatSession(systemInstruction?: string) {
  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    systemInstruction: systemInstruction 
  });

  return model.startChat();
}
