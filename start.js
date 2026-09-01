import { createServerAdapter } from '@whatwg-node/server';
import { createServer } from 'node:http';
import handler from './dist/server/server.js';

const app = createServerAdapter(handler.fetch);
const port = process.env.PORT || 3000;

createServer(app).listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

