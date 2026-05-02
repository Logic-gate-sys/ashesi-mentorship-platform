process.on('uncaughtException', (err) => {
  console.error('REAL ERROR:', err.stack); // shows exact file + line
});
process.on('unhandledRejection', (reason) => {
  console.error('UNHANDLED:', reason);
});

import { createServer } from "http";
import { initIO } from "#libs-schemas/socket/index";
import next from "next";
import {env } from './env'; 


const hostname = env.SOCKET_HOST ||"localhost";
const port = env.NEXT_PUBLIC_SOCKET_PORT ||3000;
const dev =env.NODE_ENV !=='production';

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);
  //initialise socket
  initIO(httpServer);

  httpServer.once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`Server Ready on http://${hostname}:${port}`);
    });
});