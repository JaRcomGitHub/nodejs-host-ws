const WebSocket = require("ws");
const fs = require("fs/promises");
const path = require("path");
// const dotenv = require("dotenv");
// dotenv.config();
// const { WS_URL_PORT } = process.env;

function main() {
  let ws = connectToWebSocket();

  setInterval(() => {
    // check connect ws
    // if(3=CLOSED) The connection is closed or couldn't be opened.
    if (ws?.readyState === 3) {
      // try reconnect to ws
      ws = connectToWebSocket();
    }
  }, 10000); // every 10 sec check connect ws and try reconnect to ws
}

main();

let status_ws = null;
function connectToWebSocket() {
  let ws = new WebSocket("ws://localhost:3000");

  ws.onerror = function (error) {
    if (status_ws !== false) {
      status_ws = false;
      // console.log("ws.onerror", new Date().toISOString());
      consoleLogToFile("ws onerror " + new Date().toISOString());
    }
  };

  ws.onopen = function (e) {
    if (status_ws !== true) {
      status_ws = true;
      // console.log("ws.onopen", new Date().toISOString());
      consoleLogToFile("ws onopen " + new Date().toISOString());
    }
  };

  ws.onmessage = (e) => {
    toLogFile(e.data);
    // console.log("ws: " + e.data);
  };

  return ws;
}

async function toLogFile(content) {
  const filename = getCurrentDate() + ".log";
  const logFile = path.resolve(__dirname, "logs", filename);
  try {
    await fs.appendFile(logFile, content + "\n");
  } catch (err) {
    console.log(err);
  }
}

function getCurrentDate() {
  return new Date()
    .toISOString()
    .replace("-", "")
    .replace("-", "")
    .replace(/\T.+/, "");
}

async function consoleLogToFile(content) {
  const filename = "console.log";
  const logFile = path.resolve(__dirname, "logs", filename);
  try {
    await fs.appendFile(logFile, content + "\n");
  } catch (err) {
    console.log(err);
  }
}
