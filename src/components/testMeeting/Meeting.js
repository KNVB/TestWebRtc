import io from "socket.io-client";
import WebRTC from './WebRTC';
export default class Meeting{
    constructor(){
        let dataEventHandler;
        let initialPeerListEventHandler,newPeerEventHandler,removePeerEventHandler,streamEventHandler;
        let peerList={};
        let socket = io.connect(process.env.REACT_APP_SOCKET_URL + "testMeeting", {
            transports: ["websocket"],
        });

        socket.on("newPeer", (peer) => {
            console.log("new peer event received.");
            socket.emit("askConnect",{from:socket.id,to:peer.socketId});
            let webRTC=initWebRTC(peer);
            webRTC.call();
            peerList[peer.socketId]=webRTC;
            if (newPeerEventHandler){
                newPeerEventHandler(peer);
            }
        });
        socket.on("removePeer", (socketId) => {
            console.log("remove peer event received.");
            delete peerList[socketId];
            if (removePeerEventHandler){
                removePeerEventHandler(socketId);
            }            
        });
        socket.on('requestConnect',(remotePeer)=>{
            console.log("Received connect request from "+remotePeer.name+".");
            let webRTC=initWebRTC(remotePeer);
            peerList[remotePeer.socketId]=webRTC;
        });
        socket.on("signalData",async (param)=>{
            console.log("Rececived signal Data:"+ peerList[param.from].peerName);
            await peerList[param.from].signal(param.signalData);
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
//===========================================================================================================
        let handleDataEvent=(data,peer)=>{
            console.log("Rececived data event from "+peer.name);
            if (dataEventHandler){
                dataEventHandler(data,peer);
            }
        }
        let handleStreamEvent=(stream,peer)=>{
            console.log("Rececived stream event from "+peer.name);
            if (streamEventHandler){
                streamEventHandler(stream,peer);
            }
        }
        let initWebRTC=(peer)=>{
            let webRTC=new WebRTC(peer.name);
            webRTC.on("connect",()=>{
                msgLogger("Connection to "+peer.name+" is established.");
            })
            webRTC.on('signal',data=>{
                //console.log(peerName+" send signal event.");
                socket.emit("signalData",{to:peer.socketId,signalData:data});
            });
            webRTC.on("data",(data)=>{
                handleDataEvent(data,peer);
            });
            webRTC.on("stream",(stream)=>{
                handleStreamEvent(stream,peer);
            })
            webRTC.init();
            return webRTC
        }
        let msgLogger=(msg)=>{
            console.log(msg);
        }        
    }
}