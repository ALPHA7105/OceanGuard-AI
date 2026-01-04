
import { GoogleGenAI, Type } from "@google/genai";
import { DetectionResult } from "../types";

export const detectPollution = async (base64Image: string): Promise<DetectionResult> => {
  // Fix: Create instance right before API call to ensure it uses the correct API key from process.env
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = 'gemini-3-flash-preview';
  
  const prompt = `
    Analyze this image for marine pollution and plastic waste. 
    Act as a marine conservation expert. 
    Identify specific types of plastic or waste.
    Determine a severity level (low, medium, high) based on the amount of pollution visible.
    Provide a detailed description of the environmental impact and actionable conservation recommendations.
  `;

  const imagePart = {
    inlineData: {
      mimeType: 'image/jpeg',
      data: base64Image,
    },
  };

  try {
    const response = await ai.models.generateContent({
      model,
      contents: { parts: [imagePart, { text: prompt }] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            detectedItems: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of identified plastic or pollution items."
            },
            severity: {
              type: Type.STRING,
              description: "Severity level: low, medium, or high."
            },
            description: {
              type: Type.STRING,
              description: "Detailed impact analysis."
            },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Actionable steps for students or conservationists."
            }
          },
          required: ["detectedItems", "severity", "description", "recommendations"]
        }
      }
    });

    // Fix: Access the generated text using the .text property (not a method)
    const jsonStr = response.text || '{}';
    const result = JSON.parse(jsonStr.trim());
    return result as DetectionResult;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to analyze image. Please try again.");
  }
};
