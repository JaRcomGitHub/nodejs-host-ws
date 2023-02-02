

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