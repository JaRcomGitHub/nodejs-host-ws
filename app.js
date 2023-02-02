const http = require("http");
const WebSocket = require("ws");
const path = require("path");
const fs = require("fs/promises");

var server = http.createServer(function (req, res) {
  res.writeHead(200, { "Content-Type": "text/plain" });
  var message = "It works! jarcom!!!\n",
    version = "NodeJS " + process.versions.node + "\n",
    response = [message, version].join("\n");
  res.end(response);
});
server.listen();
console.log("server start");

const ws = new WebSocket("ws://dev.tirascloud.com:4033");
ws.onmessage = (e) => {
  toLogFile(e.data);
  console.log("ws:", e.data);
};
console.log("ws start");

async function toLogFile(content) {
  const filename = getCurrentDate() + ".log";
  const logFile = path.resolve(__dirname, "logs", filename);
  // console.log(logFile);
  try {
    // const content = "Some content!";
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
