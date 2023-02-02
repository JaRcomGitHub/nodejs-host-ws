const fs = require('fs').promises;

console.log("test");

fs.readFile('package.json')
  .then(data => console.log(data.toString()))
  .catch(err => console.log(err.message));

fs.readdir(__dirname)
  .then(files => {
    return Promise.all(
      files.map(async filename => {
        const stats = await fs.stat(filename);
        return {
          Name: filename,
          Size: stats.size,
          Date: stats.mtime,
        };
      }),
    );
  })
  .then(result => console.table(result));
  




const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});






const WebSocketServer = new require('ws');

const wss = new WebSocketServer.Server({ port: 8080 });

let clients = [];

wss.on('connection', ws => {
  let id = clients.length;
  clients[id] = ws;
  console.log(`Hoвoe соединение #${id}`);
  // отправляем клиенту сообщение
  clients[id].send(`Привет, вам присвоен номер №${id}`);
  // отправляем все остальным
  clients.forEach((item, index) => {
    if (index !== id) {
      item.send(`К нам присоединился номер - ${id}`);
    }
  });
});

//html
const ws = new WebSocket('ws://localhost:8080');
ws.onmessage = e => {
  console.log(e.data);
};







var http = require('http');
var server = http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    var message = 'It works! jarcom!\n',
        version = 'NodeJS ' + process.versions.node + '\n',
        response = [message, version].join('\n');
    res.end(response);
});
server.listen(3000, () => {
    console.log('server start');
  });









