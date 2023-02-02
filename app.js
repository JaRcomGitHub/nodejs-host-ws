const http = require('http');
const WebSocket = require('ws');

var server = http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    var message = 'It works! jarcom!!!\n',
        version = 'NodeJS ' + process.versions.node + '\n',
        response = [message, version].join('\n');
    res.end(response);
});
server.listen();
console.log("server start");
    

const ws = new WebSocket('ws://dev.tirascloud.com:4033');
ws.onmessage = e => {
  console.log("ws:",e.data);
};
console.log("ws start");