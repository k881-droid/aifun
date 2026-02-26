import { GoogleGenAI, Type } from "@google/genai";

// Use process.env.GEMINI_API_KEY as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface GlyphData {
  path: string;
  width: number;
}

export type FontMap = Record<string, GlyphData>;

export async function generateMushedFont(baseFonts: string[], targetText: string): Promise<FontMap> {
  if (!process.env.GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is missing");
    return {};
  }

  const uniqueChars = Array.from(new Set(targetText.replace(/\s/g, '').split(''))).join('');
  if (!uniqueChars) return {};

  const prompt = `
    Design an experimental "mushed" font blending these styles: ${baseFonts.join(', ')}.
    
    Create unique SVG paths for these characters: ${uniqueChars}
    
    Rules:
    - 100x100 coordinate system.
    - Single SVG path per character.
    - Hybrid look: mix serifs, thick strokes, and jittery lines.
    - Return a JSON array of objects.
    
    Format:
    [
      { "char": "A", "path": "M10 80 L50 20 L90 80", "width": 80 },
      ...
    ]
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              char: { type: Type.STRING },
              path: { type: Type.STRING },
              width: { type: Type.NUMBER }
            },
            required: ["char", "path", "width"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) return {};

    const parsedArray = JSON.parse(text);
    const fontMap: FontMap = {};
    parsedArray.forEach((item: any) => {
      if (item.char && item.path) {
        fontMap[item.char] = { path: item.path, width: item.width || 70 };
      }
    });
    
    return fontMap;
  } catch (e) {
    console.error("Generative font error:", e);
    return {};
  }
}
