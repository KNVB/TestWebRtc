require('dotenv-flow').config();
const express = require('express');
const app = express();
const http =require('http');
const httpServer= http.createServer(app);
const io = require('socket.io')(httpServer);
let Test=require('./test/Test');
httpServer.listen(process.env.REACT_APP_SOCKET_PORT, () =>{
  console.log('Express server is running on localhost:'+process.env.REACT_APP_SOCKET_PORT);
});
io.of("/test").on("connection",(socket)=>{
	let test=new Test(socket);
})
