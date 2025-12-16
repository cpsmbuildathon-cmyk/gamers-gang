import { GoogleGenAI, Type, Schema } from "@google/genai";
import { TriviaQuestion } from "../types";

const apiKey = process.env.API_KEY || '';

// Initialize AI client
const ai = new GoogleGenAI({ apiKey });
const modelFlash = 'gemini-2.5-flash';

// --- TRIVIA GAME ---
export const generateTriviaQuestion = async (topic: string = "general knowledge"): Promise<TriviaQuestion> => {
  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      question: { type: Type.STRING },
      options: { type: Type.ARRAY, items: { type: Type.STRING } },
      correctAnswer: { type: Type.STRING },
      fact: { type: Type.STRING },
    },
    required: ["question", "options", "correctAnswer", "fact"],
  };

  try {
    const response = await ai.models.generateContent({
      model: modelFlash,
      contents: `Generate a fun, challenging trivia question about ${topic}. Provide 4 options.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        systemInstruction: "You are a trivia host. Questions should be interesting and varied."
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as TriviaQuestion;
    }
    throw new Error("No response text");
  } catch (e) {
    console.error("Trivia Gen Error", e);
    // Fallback question
    return {
      question: "Which planet is known as the Red Planet?",
      options: ["Earth", "Mars", "Jupiter", "Venus"],
      correctAnswer: "Mars",
      fact: "Mars owes its red color to iron oxide (rust) on its surface."
    };
  }
};

// --- DUNGEON TEXT ADVENTURE ---
export const playDungeon = async (history: { role: 'user' | 'model'; text: string }[], action: string): Promise<string> => {
  try {
    const chat = ai.chats.create({
      model: modelFlash,
      config: {
        systemInstruction: "You are a Dungeon Master for a text adventure. Keep responses concise (under 50 words). Be descriptive but snappy. The player starts with 100 HP. If they do something dangerous, reduce HP. If HP hits 0, say 'GAME OVER'. Start the story in a mysterious neon-lit cyberpunk ruin.",
      },
      history: history.map(h => ({ role: h.role, parts: [{ text: h.text }] })),
    });

    const result = await chat.sendMessage({ message: action });
    return result.text || "The dungeon falls silent...";
  } catch (e) {
    console.error("Dungeon Error", e);
    return "A glitch in the matrix prevents you from moving forward.";
  }
};

// --- WORD DUEL ---
export const checkWordDuel = async (currentWord: string, playerWord: string): Promise<{ isValid: boolean; message: string; nextWord?: string }> => {
  try {
    const prompt = `We are playing a word chain game. Current word is "${currentWord}". Player replied "${playerWord}".
    Rules:
    1. Player word must start with the last letter of current word.
    2. Player word must be a valid English word.
    
    If invalid, explain why in 'message' and set 'isValid' to false.
    If valid, generate a 'nextWord' that starts with the last letter of the player's word, set 'isValid' to true, and a brief 'message'.
    
    Respond in JSON.`;

    const schema: Schema = {
      type: Type.OBJECT,
      properties: {
        isValid: { type: Type.BOOLEAN },
        message: { type: Type.STRING },
        nextWord: { type: Type.STRING },
      },
      required: ["isValid", "message"],
    };

    const response = await ai.models.generateContent({
      model: modelFlash,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (e) {
    return { isValid: false, message: "AI connection failed." };
  }
};

// --- EMOJI ALCHEMY ---
export const mixEmojis = async (e1: string, e2: string): Promise<{ name: string; description: string }> => {
  try {
    const schema: Schema = {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING },
        description: { type: Type.STRING },
      },
      required: ["name", "description"]
    };

    const response = await ai.models.generateContent({
      model: modelFlash,
      contents: `Combine these two emojis into a new concept/item: ${e1} + ${e2}. Give it a cool RPG-style name and a 1-sentence funny description.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (e) {
    return { name: "Glitch", description: "The alchemy failed." };
  }
};

// --- MYSTERY 20 ---
export const startMystery = async (): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: modelFlash,
      contents: "Pick a random simple object (e.g., Apple, Guitar, Toaster). Just return the word.",
    });
    return (response.text || "Cat").trim();
  } catch {
    return "Cat";
  }
}

export const checkMysteryGuess = async (secret: string, questionOrGuess: string): Promise<{ response: string; won: boolean }> => {
  try {
    const schema: Schema = {
        type: Type.OBJECT,
        properties: {
            response: { type: Type.STRING },
            won: { type: Type.BOOLEAN }
        }
    }
    const response = await ai.models.generateContent({
      model: modelFlash,
      contents: `The secret word is "${secret}". The user asks: "${questionOrGuess}". 
      If they guess the word exactly, won is true. 
      Otherwise, answer their question with "Yes", "No", or "Maybe" only. If it's not a Yes/No question, tell them to ask a Yes/No question.`,
      config: {
          responseMimeType: "application/json",
          responseSchema: schema
      }
    });
    return JSON.parse(response.text || "{}");
  } catch {
    return { response: "I am confused.", won: false };
  }
}

// --- HYPER TYPER ---
export const getTypingText = async (): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: modelFlash,
            contents: "Generate a weird, funny, nonsensical but grammatically correct paragraph of exactly 40 words. No newlines.",
        });
        return (response.text || "").replace(/\n/g, ' ').trim();
    } catch {
        return "The quick brown fox jumps over the lazy dog but the dog was actually a robot in disguise waiting for the moment to strike back at the tyranny of the foxes.";
    }
}
