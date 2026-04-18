import { GoogleGenAI } from "@google/genai";
import readLineSync from 'readline-sync'

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const History = []

async function LLM(userInput) {


  History.push({
    role: 'user',
    parts: [{ text: userInput }]
  })

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: History,
  });
  console.log(response.text);

  History.push({
    role: 'model',
    parts: [{ text: response.text }]
  })

}

async function main() {
  const userInput = readLineSync.question("Ask me anything ---> ")

  await LLM(userInput)
  main()
}

main()
