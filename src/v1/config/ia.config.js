import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.IA_API_KEY;

if (!apiKey) {
    throw new Error("Falta la variable IA_API_KEY");
}

const iaClient = new GoogleGenAI({ apiKey });

export const GEMINI_MODEL = "gemini-3.5-flash-lite";

export default iaClient;