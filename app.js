const WebSocket1 = require("ws");
const path = require("path");
const fs = require("fs/promises");

const ws = new WebSocket1("ws://dev.tirascloud.com:4033");
ws.onmessage = (e) => {
  toLogFile(e.data);
  console.log("ws:", new Date().toISOString());
};
console.log("ws start", new Date().toISOString());

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
