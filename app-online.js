const WebSocket = require("ws");
const fs = require("fs/promises");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();
const { WS_URL_PORT } = process.env;

const devices = {};

function main() {
  let ws = connectToWebSocket();

  setInterval(() => {
    // check connect ws if(3=CLOSED) The connection is closed or couldn't be opened.
    if (ws?.readyState === 3) {
      ws = connectToWebSocket(); // try reconnect to ws
    }
  }, 10000); // every 10 sec check connect ws and try reconnect to ws
}

main();

let status_ws = null;
function connectToWebSocket() {
  let ws = new WebSocket(WS_URL_PORT);

  ws.onerror = function (error) {
    if (status_ws !== false) {
      status_ws = false;
      console.log("ws.onerror", new Date().toISOString());
      // consoleToLogFile("ws onerror " + new Date().toISOString());
    }
  };

  ws.onopen = function (e) {
    if (status_ws !== true) {
      status_ws = true;
      console.log("ws.onopen", new Date().toISOString());
      // consoleToLogFile("ws onopen " + new Date().toISOString());
    }
  };

  ws.onmessage = (e) => {
    // dataToLogFile(e.data);
    // console.log("ws: " + e.data);
    const values = strParseJson(e.data);
    //console.log("ws2: " + values);
    console.log(values);
  };

  return ws;
}

function strParseJson(strJSON) {
  const obj = JSON.parse(strJSON);
  const str = obj.diag;
  const { did, time } = obj;
  const aSN = str.match("(?<=SN:)[0-9a-fA-F]*");
  const aver = str.match("(?<=ver:)[0-9.]*");
  const aid = str.match("(?<=id:)[0-9]*");
  const str2 = str.slice(aid.index);
  const temp = str2.match("(?<=, )");
  const msg = str2.slice(temp.index);

  const sn = aSN ? aSN[0] : "";
  const ver = aver ? aver[0] : "";
  const id = aid ? aid[0] * 1 : "";

  const data = { ppk: did, time, sn, ver, id, msg };
  return data;
}

function getCurrentDate() {
  return new Date()
    .toISOString()
    .replace("-", "")
    .replace("-", "")
    .replace(/\T.+/, "");
}

async function dataToLogFile(content) {
  const filename = getCurrentDate() + ".log";
  const logFile = path.resolve(__dirname, "logs", filename);
  try {
    await fs.appendFile(logFile, content + "\n");
  } catch (err) {
    console.log(err);
  }
}

async function consoleToLogFile(content) {
  const filename = "console.log";
  const logFile = path.resolve(__dirname, "logs", filename);
  try {
    await fs.appendFile(logFile, content + "\n");
  } catch (err) {
    console.log(err);
  }
}
