import { GoogleGenAI } from '@google/genai';
import readlineSync from 'readline-sync';
import executeCommand, { toolsDeclaration } from './tool.js';
import os from 'os'

const platform = os.platform

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const history = [];

async function runAgent(userQuery) {

  history.push({
    role: 'user',
    parts: [{ text: userQuery }]
  })

  try {

    while (true) {

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: history,
        config: {
          tools: toolsDeclaration,
          systemInstruction: `You are an website builder expert. You have to create the frontend of the website by analyzing the user input. You have accessed of tools, which can run or execute any terminal or shell command.
          
          And the current user's operating system is: ${platform} 
          Give command to the user, according to the operating system support.

          <-- What is your job -->
          1: Analyze the user's query to see what type of website they want to build.
          2: Give the command one by one, step by step
          3: Use available tool executeCommand

          // You can give them command in following below
          1: First create a folder, E.g. : mkdir 'calculator'
          2: Inside the folder, create index.html, E.g. : touch 'calculator/index.html'
          3: Then create style.css same as above
          4: Then create script.js
          5: Then write a code in html file

          You have to provide the terminal/shell command to the user, they will directly execute it
          `
        }
      });

      if (response.functionCalls && response.functionCalls.length > 0) {

        const { name, args, id } = response.functionCalls[0]

        console.log(response.functionCalls)


        const result = await executeCommand(args)


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

  } catch (error) {
    console.error('Error running the agent', error)
  }
}

async function main() {
  const userQuery = readlineSync.question('What to build-> ')


  await runAgent(userQuery)

  main()
}

main()