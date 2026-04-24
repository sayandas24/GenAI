import 'dotenv/config'
import agent from "./agent.js";

async function runAgent(userQuery) {

  const response = await agent(userQuery)
  return response
}

export default runAgent