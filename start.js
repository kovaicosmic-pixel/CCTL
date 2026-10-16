import { createServerAdapter } from '@whatwg-node/server';
import { createServer } from 'node:http';

// Load .env (PORT, DATABASE_URL, RESEND_API_KEY, CAREERS_*) before the app code
// runs, so the server works however it's launched (pm2, node start.js, …).
// Variables already set in the real environment take precedence.
try {
  process.loadEnvFile();
} catch {
  // No .env file — rely on the real environment instead.
}

const { default: handler } = await import('./dist/server/server.js');

const app = createServerAdapter(handler.fetch);
const port = process.env.PORT || 3000;

createServer(app).listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
