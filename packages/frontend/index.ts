import { createServer } from 'http';
import { parse } from 'url';
import httpProxy from 'http-proxy';
import next from 'next';

const port = parseInt(process.env.PORT || '4000', 10);
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const proxy = httpProxy.createProxyServer();

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);
    const { pathname, query } = parsedUrl;    

    if (pathname === '/api') {
      // proxy to api server (nestjs package)
      proxy.web(req, res, { target: 'http://localhost:4001' });
    } else {
      handle(req, res, parsedUrl);
    }
  }).listen(port);

  // tslint:disable-next-line:no-console
  console.log(
    `> Server listening at http://localhost:${port} as ${
      dev ? 'development' : process.env.NODE_ENV
    }`
  );
});