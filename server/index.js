import dotenv from 'dotenv-flow';
import express from 'express';
import fs from "fs";
import http from 'http';
import https from "https";
import {fileURLToPath} from 'url';
import { Server } from "socket.io";
//import B from './b/B.js';
import C from './c/C.js';
import T from './t/T.js';
import TestPureWebRTC from './testPureWebRTC/TestPureWebRTC.js';
import TestSimplePeer from './testSimplePeer/TestSimplePeer.js';
import path from "path";
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let httpServer;

dotenv.config();
if (process.env.NODE_ENV === "production") { 
  app.use(express.static(path.resolve(__dirname, '../build')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../build', 'index.html'));
  });
}
/*****************************************************************/
/* If the server is connected to the internet via a web server   */
/* that have SSL cert, use the following line to start the       */ 
/* backend.                                                      */    
/*****************************************************************/
httpServer = http.createServer(app);

/*****************************************************************/
/* If the server is connected to the internet directly, you have */
/* to provide SSL certificate ,uncomment the following code,     */ 
/* and then comment the above line.                              */   
/*****************************************************************/
/*
let options = {
  key: fs.readFileSync(path.join(__dirname,'./server.key')),
  cert: fs.readFileSync(path.join(__dirname,'./server.cert'))
};
httpServer = https.createServer(options, app);
*/

const io = new Server(httpServer);
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