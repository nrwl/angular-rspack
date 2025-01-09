import { createServer } from '@ng-rsbuild/plugin-angular/ssr';
import bootstrap from './main.server';
import serverless from 'serverless-http';
import { readdirSync } from 'fs';
import { dirname } from 'path';

const netlifyOpts = {
  browserDistFolder: '../browser',
};
console.log('server dirname', __dirname, readdirSync(dirname(__dirname)));

const server = createServer(
  bootstrap,
  process.env['NETLIFY_BUILD'] ? netlifyOpts : undefined
);

/** Add your custom server logic here
 *
 * For example, you can add a custom static file server:
 * server.app.use('/static', express.static(staticFolder));
 * Or add additional api routes:
 * server.app.get('/api/hello', (req, res) => {
 *   res.send('Hello World!');
 * });
 * Or add additional middleware:
 * server.app.use((req, res, next) => {
 *   res.send('Hello World!');
 * });
 */
let _handler;
if (process.env['NETLIFY_BUILD']) {
  _handler = serverless(server.app);
} else {
  server.listen();
}

export const handler = _handler;
