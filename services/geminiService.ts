
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";

export const getMoleculeInfo = async (moleculeName: string): Promise<string> => {
  // Always use process.env.API_KEY directly for initialization as per guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Tell me about the molecule: ${moleculeName}`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });
    // response.text is a property, not a method
    return response.text || "No information available.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error connecting to chemistry database.";
  }
};
