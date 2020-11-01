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
	console.log("Connection established");
	socket.on("sendICECandidate",iceCandidate=>{
		console.log("Receive an iceCandidate");
		socket.broadcast.emit('receiveICECandidate',iceCandidate);
	});
	socket.on("sendAnswer",answer=>{
		console.log("Receive an answer event");
		socket.broadcast.emit("receiveAnswer",answer);
	});
	socket.on("sendOffer",offer=>{
		console.log("Receive an offer event");
		socket.broadcast.emit("receiveOffer",offer);
	});
	socket.on('disconnect', (reason) => {
		console.log("Client disconntected,reason:"+reason);
	});
})