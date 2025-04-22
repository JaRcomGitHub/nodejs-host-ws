const WebSocket = require("ws");
const fs = require("fs/promises");
const path = require("path");

const DIRECTORY_PATH_TO_FILES = "../logs_ppk/";
const DEVICES_FILE = "devices-buf-data.json";
const devices = require(DIRECTORY_PATH_TO_FILES + DEVICES_FILE);

//------------------------------------------------------

//s. если запускать файл сам по себе
const dotenv = require("dotenv");
dotenv.config();
const { WS_URL_PORT } = process.env;

//wsClientListen(WS_URL_PORT); // запуск приложения
//e. если запускать файл сам по себе

//s. если в связке
// module.exports = { wsClientListen, devices };
//e. если в связке

//------------------------------------------------------

function wsClientListen(ws_port) {
  let ws = connectToWebSocket(ws_port);

  setInterval(() => {
    // check connect ws if(3=CLOSED) The connection is closed or couldn't be opened.
    if (ws?.readyState === 3) {
      // try reconnect to ws
      ws = connectToWebSocket();
    }
    // console.log(devices);
    dataWorking(devices);
  }, 10000); // every 10 sec check connect ws and try reconnect to ws
}

let status_ws = null;
function connectToWebSocket(ws_port) {
  let ws = new ReconnectingWebSocket(ws_port);

 /* ws.onerror = function (error) {
    if (status_ws !== false) {
      status_ws = false;
      // console.log("ws.onerror", new Date().toISOString());
      consoleLogToFile("ws onerror " + new Date().toISOString());
    }
  };
 */
  ws.onopen = function (e) {
    if (status_ws !== true) {
      status_ws = true;
      // console.log("ws.onopen", new Date().toISOString());
      consoleLogToFile("ws onopen " + new Date().toISOString());
    }
  };

  ws.onmessage = (e) => {
    dataAddToLogFile(e.data);
    // console.log("ws: " + e.data);
    const values = strParseJson(e.data);
    // console.log(values);
    addDataToDevice(values);
  };

  return ws;
}

async function dataAddToLogFile(content) {
  const filename = getCurrentDate() + ".log";
  const logFile = path.resolve(__dirname, DIRECTORY_PATH_TO_FILES, filename);
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
  const filename = "ws-console.log";
  const logFile = path.resolve(__dirname, DIRECTORY_PATH_TO_FILES, filename);
  try {
    await fs.appendFile(logFile, content + "\n");
  } catch (err) {
    console.log(err);
  }
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

function addDataToDevice(data) {
  const { ppk, time, sn, ver, id, msg } = data;

  // // кусок временно для отладки - отображение времени сообщения
  // const date = new Date(time * 1000);
  // // console.log(date.toISOString());
  // var hours = date.getHours(); // Hours part from the timestamp
  // var minutes = "0" + date.getMinutes(); // Minutes part from the timestamp
  // var seconds = "0" + date.getSeconds(); // Seconds part from the timestamp
  // // Will display time in 10:30:23 format
  // var formattedTime =
  //   hours + ":" + minutes.substr(-2) + ":" + seconds.substr(-2);
  // console.log(formattedTime, ppk, sn, msg);

  if (!devices.hasOwnProperty(ppk)) {
    devices[ppk] = { [sn]: { ver, id, msgs: [time, msg] } };
  } else {
    const d = devices[ppk];
    if (!d.hasOwnProperty(sn)) {
      devices[ppk] = { [sn]: { ver, id, msgs: [time, msg] } };
    } else {
      d[sn].ver = ver;
      d[sn].id = id;
      d[sn].msgs.push(time, msg);
      const size = d[sn].msgs.length;
      const maxsize = 10 * 2; // сообщение состоит из времени и строки
      if (size > maxsize) {
        for (let index = 0; index < size - maxsize; index++) {
          d[sn].msgs.shift();
        }
      }
      //d[sn].msgl = d[sn].msgs.length / 2; // текущее количество сообщений
    }
    devices[ppk] = { ...devices[ppk], ...d };
  }
}

async function dataWorking(obj) {
  const dataFile = path.resolve(
    __dirname,
    DIRECTORY_PATH_TO_FILES,
    DEVICES_FILE
  );
  const content = JSON.stringify(obj, null, " ");
  try {
    await fs.writeFile(dataFile, content + "\n");
  } catch (err) {
    console.log(err);
  }
}

// Клиент с реконнектом.
class ReconnectingWebSocket {
  constructor(url, protocols = []) {
    this.url = url;
    this.protocols = protocols;

    this.reconnectDelay = 1000; // ms
    this.maxReconnectDelay = 30000;
    this.messageQueue = [];

    this.listeners = {
      open: [],
      close: [],
      error: [],
      message: [],
    };

    this._connect();
  }

  _connect() {
    this.ws = new WebSocket(this.url, this.protocols);

    this.ws.addEventListener('open', (e) => {
      this._flushQueue();
      this._emit('open', e);
    });

    this.ws.addEventListener('message', (e) => {
      this._emit('message', e);
    });

    this.ws.addEventListener('close', (e) => {
      this._emit('close', e);
      this._reconnect();
    });

    this.ws.addEventListener('error', (e) => {
      this._emit('error', e);
      this.ws.close();
    });
  }

  _reconnect() {
    setTimeout(() => {
      this.reconnectDelay = Math.min(this.reconnectDelay * 2, this.maxReconnectDelay);
      this._connect();
    }, this.reconnectDelay);
  }

  _flushQueue() {
    while (this.messageQueue.length > 0) {
      this.send(this.messageQueue.shift());
    }
    this.reconnectDelay = 1000; // reset delay after successful connect
  }

  send(data) {
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(data);
    } else {
      this.messageQueue.push(data);
    }
  }

  close(code, reason) {
    this.ws.close(code, reason);
    this.messageQueue = []; // optional: clear queued messages
  }

  on(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event].push(callback);
    }
  }

  off(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
  }

  _emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(cb => cb(data));
    }
  }
}

const connection = connectToWebSocket(WS_URL_PORT);