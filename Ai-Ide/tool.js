import { exec } from 'child_process';
import { promisify } from 'util';

const asyncExecute = promisify(exec)

async function executeCommand({ command }) {
  try {
    const { stdout, stderr } = await asyncExecute(command)

    if (stderr) {
      return `Error: ${stderr}`
    }

    return `Success: ${stdout || `Task executed successfully ✓`}`

  } catch (error) {
    return `Error: ${error}`
  }
}

export const toolsDeclaration = [{
  functionDeclarations: [
    {
      name: "executeCommand",
      description: "Execute a single terminal/shell command. A command can be to create a folder, file, write on a file, edit the file or delete the file",
      parameters: {
        type: "OBJECT",
        properties: {
          command: {
            type: "STRING",
            description: "It'll be a single terminal command. E.g. : 'mkdir calculator' "
          },

        },
        required: ["command"]
      }
    },
  ]
}];

export default executeCommand