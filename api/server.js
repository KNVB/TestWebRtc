var cors = require('cors')
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
app.use(cors());
io.on('connection', (socket) => {
	//meetingManager.setSocket(io,socket);
	console.log("Connection established");
	socket.on("closeConnection",()=>{
		console.log("Close connection request received@"+getTimeString());
		socket.broadcast.emit("closeConnection", {});
	});
	socket.on("sendICECandidate",(req)=>{
		console.log("Receive an send ICE Candidate request@"+getTimeString());
		socket.broadcast.emit("receiveICECandidate", req);
	});
	socket.on("sendRollDiceResult",(rollDiceResult)=>{
		socket.broadcast.emit("receiveRollDiceResult",rollDiceResult);
	});
	socket.on("sendSDP",(sdp)=>{
		console.log("Receive an send description request@"+getTimeString());
		socket.broadcast.emit("receiveSDP", sdp);
	});
	socket.on("requestRollDice",(rollDiceResult)=>{
		socket.broadcast.emit("requestRollDice",rollDiceResult);
	});
	
	socket.on("hangUp",()=>{
		console.log("Receive hang up request");
		socket.broadcast.emit('hangUp');
	});
	/*
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
	*/
})
function getTimeString(){
	var date=new Date();
	var result=date.getHours()+":"+date.getMinutes() +":"+date.getSeconds()+"."+date.getMilliseconds();
	return result;
}