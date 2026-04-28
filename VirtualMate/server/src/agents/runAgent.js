import 'dotenv/config'
import agent from "./agent.js";

async function runAgent(userQuery, session_id) {

  const response = await agent(userQuery, session_id)
  return response
}

export default runAgent