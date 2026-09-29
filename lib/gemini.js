import {GoogleGenAI} from "@google/genai";

export function buildPrompt(data) {
    const prompt = `You are a trading guru. Given data on share prices over the past 3 days, write a report of no more than 200 words describing the stocks performance and recommending whether to buy, hold, or sell. \n${JSON.stringify(data, null, 2)}`;
    return prompt;
}

export async function generateReport(data) {
    const genai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});
    const response = await genai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: buildPrompt(data)
    })
    return response.text;
}