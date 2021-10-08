import io from "socket.io-client";
import Peer from './Peer';
export default class Meeting{
    constructor(){
        let dataEventHandler;
        let initialPeerListEventHandler,newPeerEventHandler,removePeerEventHandler,streamEventHandler;
        let peerList={};
        let socket = io.connect(process.env.REACT_APP_SOCKET_URL + "testMeeting", {
            transports: ["websocket"],
        });
        socket.on("newPeer", peer => {
            console.log("new peer event received.");
            socket.emit("askConnect",{from:socket.id,to:peer.socketId});
            let newPeer=new Peer(peer.name,peer.socketId,socket);
            newPeer.on("data",param=>{
                if (dataEventHandler){
                    dataEventHandler(param);
                }
            });
            newPeer.on("stream",param=>{
                streamEventHandler(param);
            })
            newPeer.init();
            peerList[peer.socketId]=newPeer;
            if (newPeerEventHandler){
                newPeerEventHandler(peer);
            }
        });
        this.init=(peerName)=>{  
            socket.emit("hi", peerName, (response) => {
                console.log("Say hi to peer.");
                if (initialPeerListEventHandler){
                    initialPeerListEventHandler(response.peerList);            
                }
            });
        }
        this.on=(eventType,handler)=>{
            switch (eventType){
                case "data":
                    dataEventHandler=handler;
                    break;
                case "initialPeerList":
                    initialPeerListEventHandler=handler;
                    break;
                case "newPeer":
                    newPeerEventHandler=handler;
                    break;
                case "removePeer":
                    removePeerEventHandler=handler;
                    break;
                case "stream":    
                    streamEventHandler=handler;
                    break;
            }
        }
    }
}