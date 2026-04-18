import { GoogleGenAI } from "@google/genai";
import readLineSync from 'readline-sync'

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const chat = ai.chats.create({
  model: "gemini-3-flash-preview",
  history: []
});

async function main() {

  const userInput = readLineSync.question("Ask me anything ---> ")

  const response = await chat.sendMessage({
    message: userInput
  })
  console.log(response.text)

  main()
}

main()
