import { Router } from 'express';
import { getApiKey, updateApiKey } from '../controllers/settings.controller.js';

const settingsRoute = Router();

// POST (not GET) so the password can travel in the body, not the URL/query string
settingsRoute.post('/api-key', getApiKey);
settingsRoute.put('/api-key', updateApiKey);

export default settingsRoute;
