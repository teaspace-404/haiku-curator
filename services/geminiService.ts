
import { GoogleGenAI } from "@google/genai";

// Assume process.env.API_KEY is available in the execution environment.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // This will be caught by the app's error handling and displayed to the user.
  throw new Error("API_KEY environment variable is not set. The application cannot contact the AI.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const fileToGenerativePart = (base64: string, mimeType: string) => {
  // Extracts the pure base64 data from the data URL.
  const base64Data = base64.split(',')[1];
  if (!base64Data) {
    throw new Error("Invalid base64 string provided.");
  }
  return {
    inlineData: {
      data: base64Data,
      mimeType
    },
  };
};

export const getHaikuForImage = async (base64Image: string, mimeType: string, systemInstruction: string): Promise<string> => {
  try {
    const imagePart = fileToGenerativePart(base64Image, mimeType);
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [imagePart] },
        config: {
            systemInstruction,
        },
    });

    return response.text;
  } catch (error) {
    console.error("Error generating haiku:", error);
    // Propagate a more user-friendly error message.
    throw new Error("The AI guide is currently unavailable. Please try again later.");
  }
};

export const getReflectionForImageAndText = async (base64Image: string, mimeType: string, userText: string, systemInstruction: string): Promise<string> => {
  try {
    const imagePart = fileToGenerativePart(base64Image, mimeType);
    const textPart = { text: userText };

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [imagePart, textPart] },
        config: {
            systemInstruction,
        },
    });
    
    return response.text;
  } catch (error) {
    console.error("Error generating reflection:", error);
    throw new Error("The AI guide is currently unavailable. Please try again later.");
  }
};
