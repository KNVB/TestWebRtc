import io from 'socket.io-client';
import Peer from './Peer';
export default class Meeting{
    constructor(peerName){        
        let peerId=null;
        let peerList={};
        let peerListUpdatedHandler;
        let socket=null;
        let webRtcConfig = {
            iceServers: [
                { urls: "stun:stun.stunprotocol.org" },
                { urls: "stun:stun.l.google.com:19302" },
                {
                    urls: "turn:numb.viagenie.ca",
                    credential: "turnserver",
                    username: "sj0016092@gmail.com",
                },
            ],
        };
        console.log("Meeting Object constructor is called.");
        this.connect=()=>{
            socket= io(process.env.REACT_APP_SOCKET_URL + "c", {
                transports: ["websocket"],
            });
            socket.on("askConnect",newPeer=>{
                console.log("Receive Hi Event from "+JSON.stringify(newPeer)+".");
                let peer=new Peer(newPeer.peerId,newPeer.peerName);
                peer.setConfig(webRtcConfig);
                peer.isCall=true;
                peerList[peer.peerId]=peer;                 
                peerListUpdatedHandler(peerList);
            });
            socket.on("askReconnect",peerName=>{
                console.log("Receive askReconnect Event from "+peerName+".");
            });
            socket.io.on("reconnect", () => {
                console.log("Reconnect successed.");
                socket.emit("reconnectRequest",{ peerId: peerId, peerName: peerName });
            });
            socket.on("removeId",peerId=>{
                console.log("Receive remove id event ,peerId:"+peerId);
            });
            socket.emit("hi",peerName, response => {
                peerId=response.peerId;
                let tempPeerList=response.peerList;
                console.log("==================Sent Hi Response Start===============");
                console.log("peerId:"+peerId);
                console.log("==================peer list===============");
                for (const [peerId, tempPeer] of Object.entries(tempPeerList)) {
                    let peer=new Peer(peerId,tempPeer.peerName);
                    peer.setConfig(webRtcConfig);
                    peerList[peerId]=peer;
                }
                console.log(peerList);
                peerListUpdatedHandler(peerList);
                console.log("==================Sent Hi Response End===============");
            });            
        }
        this.disconnect=()=>{
            if (socket){
                socket.disconnect();
            }            
        }
        this.on=(eventType,param)=>{
            switch (eventType) {
                case "peerListUpdated":
                    peerListUpdatedHandler=param;
                    break;
                default: break;
            }
        }
    }
}