require('dotenv-flow').config();
const express = require('express');
const app = express();
const http =require('http');
const httpServer= http.createServer(app);
const io = require('socket.io')(httpServer);
let TestMeeting=require('./testMeeting/TestMeeting_1.js');
let TestPureWebRTC=require('./testPureWebRTC/TestPureWebRTC');
let TestSimplePeer=require('./testSimplePeer/TestSimplePeer');
let TestSocket=require('./testSocket/TestSocket');
httpServer.listen(process.env.REACT_APP_SOCKET_PORT, () =>{
  console.log('Express server is running on localhost:'+process.env.REACT_APP_SOCKET_PORT);
});
let testMeeting=new TestMeeting();
let testSocket=new TestSocket();
io.of("/a").on("connection",socket=>{
	console.log("TestSocket("+socket.id+"):Connection established");
	testSocket.addPeer(socket);
})
io.of("/testMeeting").on("connection",socket=>{
	testMeeting.addPeer(socket);
});
io.of("/testPureWebRTC").on("connection",(socket)=>{
	let testPureWebRTC=new TestPureWebRTC(socket);
})
io.of("/testSimplePeer").on("connection",(socket)=>{
	let testSimplePeer=new TestSimplePeer(socket);
})
