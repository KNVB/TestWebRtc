import dotenv from 'dotenv-flow';
import express from 'express';
import http from 'http';
import {fileURLToPath} from 'url';
import { Server } from "socket.io";
//import B from './b/B.js';
import C from './c/C.js';
import T from './t/T.js';
import TestPureWebRTC from './testPureWebRTC/TestPureWebRTC.js';
import TestSimplePeer from './testSimplePeer/TestSimplePeer.js';
import path from "path";
const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);

dotenv.config();

if (process.env.NODE_ENV === "production") {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  app.use(express.static(path.resolve(__dirname, '../build')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../build', 'index.html'));
  });
}

httpServer.listen(process.env.REACT_APP_SOCKET_PORT, () => {
  console.log('Express server is running on localhost:' + process.env.REACT_APP_SOCKET_PORT);
});

//let b = new B(io, "/b");
let c = new C(io, "/c");
let t = new T(io, "/t");
/*
let testMeeting=new TestMeeting();
let testSocket=new TestSocket();
io.of("/a").on("connection",socket=>{
  console.log("TestSocket("+socket.id+"):Connection established");
  testSocket.addPeer(socket);
});

io.of("/testMeeting").on("connection",socket=>{
  testMeeting.addPeer(socket);
});
*/
io.of("/testPureWebRTC").on("connection", (socket) => {
  let testPureWebRTC = new TestPureWebRTC(socket);
})
io.of("/testSimplePeer").on("connection", (socket) => {
  let testSimplePeer = new TestSimplePeer(socket);
})