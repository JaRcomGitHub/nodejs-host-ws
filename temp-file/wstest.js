const WebSocketServer = new require("ws");

const wss = new WebSocketServer.Server({ port: 3000 });

let clients = [];

wss.on("connection", (ws) => {
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

  setInterval(() => {
    ws.send(new Date().toISOString());
  }, 5000);
});
console.log("ws server start", new Date().toISOString());
