const express = require("express");
const http = require("http");
const webSocket = require("ws");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const wss = new webSocket.Server({ server });

//document store
let document = "";

wss.on("connection", (ws) => {
  console.log("New Connection Connected");

  ws.send(JSON.stringify({ type: "init", data: document }));
  ws.on("message", (message) => {
    try {
      const parseMessage = JSON.parse(message);
      if (parseMessage.type === "update") {
        document = parseMessage.data;

        //broadcast the updated document to all connected clients
        wss.clients.forEach((client) => {
          if (client.readyState === webSocket.OPEN) {
            client.send(JSON.stringify({ type: "update", data: document }));
          }
        });
      }
    } catch (error) {
      console.log(error, "Error parsing message");
    }
  });
});

const PORT = 5000;
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
