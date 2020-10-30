var express = require('express');
var http,httpServer;
var httpServerPort = 9000,io;

//===============================================================
app = express();
http =require('http');
httpServer= http.createServer(app);
io = require('socket.io')(httpServer);

httpServer.listen(httpServerPort, function() {
  console.log('server up and running at %s port', httpServerPort);
});
io.on('connection', (socket) => {
	//meetingManager.setSocket(io,socket);	
})