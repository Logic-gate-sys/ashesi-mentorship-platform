import { createServer } from "node:http";
import { initSocketNameSpaces } from "#libs-schemas/socket/index";
import next from "next";
import {env } from './env'; 



const hostname = env.SOCKET_HOST ||"localhost";
const port = env.SOCKET_PORT ||3000;


// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);
  //initialise socket
  initSocketNameSpaces(httpServer);
  // if an error occurs
  httpServer.once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`Server Ready on http://${hostname}:${port}`);
    });
});