
import { GoogleGenAI, Type } from "@google/genai";
import { GeminiExerciseResponse } from "../types";

const exerciseSchema = {
    type: Type.OBJECT,
    properties: {
        title: { 
            type: Type.STRING, 
            description: "A concise title for the exercise." 
        },
        difficulty: { 
            type: Type.INTEGER, 
            description: "An estimated difficulty from 1 (very easy) to 5 (very hard)." 
        },
        keywords: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING }, 
            description: "A list of 3-5 relevant mathematical keywords." 
        },
        content: { 
            type: Type.STRING, 
            description: "The full content of the exercise, formatted in clean, semantic HTML with LaTeX for math. Use \\( ... \\) for inline math and \\[ ... \\] for display math. Structure content using paragraphs <p>, and lists like <ol> and <ul> for questions and sub-questions. Do not nest block elements inside <p> tags." 
        },
    },
    required: ["title", "difficulty", "keywords", "content"],
};

export interface GeminiAnalysisOptions {
  reviseText: boolean;
  boldKeywords: boolean;
}

export const analyzeImageWithGemini = async (
  apiKey: string,
  base64Image: string,
  mimeType: string,
  options: GeminiAnalysisOptions
): Promise<GeminiExerciseResponse> => {
  if (!apiKey) {
      throw new Error("API Key is missing.");
  }
  
  const ai = new GoogleGenAI({ apiKey });
  
  const systemInstructions = [
    "You are an expert in mathematics education. Your task is to analyze an image of a math exercise and extract its content into a structured JSON format, strictly adhering to the provided schema.",
    "IMPORTANT: Detect the language of the text in the image and provide your entire response (including title, keywords, and content) in that same language. DO NOT TRANSLATE the exercise.",
    "The 'content' field must be valid, semantic HTML. Use <p> for paragraphs, and nested <ol> or <ul> for lists (questions, sub-questions). All mathematical formulas must be in LaTeX, using \\( ... \\) for inline math and \\[ ... \\] for display math. The final JSON object must strictly conform to the provided schema. Do not put <p> tags inside <li> tags."
  ];

  if (options.reviseText) {
    systemInstructions.push("Proofread and correct the spelling, grammar, and vocabulary of the content to ensure professional quality.");
  }
  if (options.boldKeywords) {
    systemInstructions.push("In the HTML 'content' field, bold the keywords you've identified (from the 'keywords' array) by wrapping them in `<strong>` tags.");
  }

  const systemInstruction = systemInstructions.join(' ');
  const promptText = "Extract the exercise from this image, conforming to the JSON schema.";

  const imagePart = {
    inlineData: {
      data: base64Image,
      mimeType,
    },
  };
  
  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: { parts: [imagePart, { text: promptText }] },
        config: {
            systemInstruction: systemInstruction,
            responseMimeType: "application/json",
            responseSchema: exerciseSchema,
        },
    });

    const jsonString = response.text;
    const result = JSON.parse(jsonString);
    
    if (result && typeof result.title === 'string' && typeof result.content === 'string') {
        return result as GeminiExerciseResponse;
    } else {
        throw new Error("Invalid JSON structure received from API.");
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Gemini API Error: ${error.message}`);
    }
    throw new Error("An unknown error occurred while calling the Gemini API.");
  }
};


export const verifyGeminiApiKey = async (apiKey: string): Promise<boolean> => {
    if (!apiKey) return false;
    try {
        const ai = new GoogleGenAI({ apiKey });
        // Make a lightweight, non-generative call to verify the key.
        // A simple prompt with minimal output is a good way to test connectivity and authentication.
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: 'ping',
            config: {
                maxOutputTokens: 1,
                thinkingConfig: { thinkingBudget: 0 }
            }
        });
        // Check if we got a valid response structure
        return !!response.text;
    } catch(e) {
        console.error("API Key verification failed:", e);
        return false;
    }
}