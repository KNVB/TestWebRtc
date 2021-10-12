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
            msgLogger("new peer event received.");
            socket.emit("askConnect",{from:socket.id,to:peer.socketId});
            let newPeer=initPeer(peer);            
            peerList[peer.socketId]=newPeer;
            newPeer.call();
            if (newPeerEventHandler){
                newPeerEventHandler(peer);
            }
        });
        socket.on("removePeer", (socketId) => {
            console.log("remove peer event received.");
            if (peerList[socketId]){
                peerList[socketId].hangUp();
                delete peerList[socketId];
            }
            if (removePeerEventHandler){
                removePeerEventHandler(socketId);
            }
        });
        socket.on('requestConnect',(remotePeer)=>{
            msgLogger("Received connect request from "+remotePeer.name+".");
            let newPeer=initPeer(remotePeer);            
            peerList[remotePeer.socketId]=newPeer;            
        });
        socket.on("signalData",async (param)=>{
            msgLogger("Rececived signal Data from "+peerList[param.from].name);
            peerList[param.from].signal(param.signalData);
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
                default:
                    break    
            }
        }
        this.setStream=(localStream)=>{
            setStream(localStream);
        }
//==============================================================================================================
        let initPeer=(peer)=>{
            let newPeer=new Peer(peer.name,peer.socketId,socket);
            newPeer.on("data",param=>{
                if (dataEventHandler){
                    dataEventHandler(param);
                }
            });
            newPeer.on("stream",param=>{
                msgLogger("Recevived Stream event from "+peer.name);
                streamEventHandler(param);
            })
            newPeer.init();
            return newPeer;
        }
        let setStream=(stream)=>{
            console.log("set Stream::"+JSON.stringify(peerList));
            Object.keys(peerList).forEach(key=>{
                msgLogger("Setting stream to "+peerList[key].name);
                peerList[key].setStream(stream);
                //console.log(peerList[key]);
            })
        }
        let msgLogger=(msg)=>{
            console.log(msg);
        }        
    }
}