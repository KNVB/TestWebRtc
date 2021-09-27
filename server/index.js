require('dotenv-flow').config();
const express = require('express');
const app = express();
const http =require('http');
const httpServer= http.createServer(app);
const io = require('socket.io')(httpServer, {
	allowEIO3: true
});
let TestSimplePeer=require('./testSimplePeer/TestSimplePeer');
httpServer.listen(process.env.REACT_APP_SOCKET_PORT, () =>
  console.log('Express server is running on localhost:'+process.env.REACT_APP_SOCKET_PORT)
);

io.of("/testSimplePeer").on("connection",(socket)=>{
	let testSimplePeer=new TestSimplePeer(socket);
})