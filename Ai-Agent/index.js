import { GoogleGenAI } from '@google/genai';
import readlineSync from 'readline-sync';
import { executableTools, toolsDeclaration } from './tool.js';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });


const history = [];

async function runAgent(userQuery) {

  history.push({
    role: 'user',
    parts: [{ text: userQuery }]
  })

  while (true) {

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: history,
      config: {
        tools: toolsDeclaration
      }
    });

    if (response.functionCalls && response.functionCalls.length > 0) {

      const { name, args, id } = response.functionCalls[0]

      console.log(response.functionCalls)

      const funCall = executableTools[name]
      const result = await funCall(args)


      const functionResponsePart = {
        name: name,
        response: {
          result: result
        },
        id: id
      }

      // push the query into history first
      history.push({
        role: 'model',
        parts: response.candidates[0].content.parts
      })

      // function result push into history also
      history.push({
        role: 'user',
        parts: [
          {
            functionResponse: functionResponsePart
          }
        ]
      })


    } else {
      history.push({
        role: 'model',
        parts: [{ text: response.text }]
      })
      console.log(response.text)

      break;
    }

  }
}


async function main() {
  const userQuery = readlineSync.question('Ask anything ->')

  await runAgent(userQuery)
  main()
}

main()