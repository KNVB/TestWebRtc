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
                peer.on("signal",signalData=>{
                    let temp={from:peerId,to:peer.peerId,signalData};
                    //console.log("temp="+JSON.stringify(temp));
                    socket.emit("signal",temp);
                });
                peer.setConfig(webRtcConfig);
                peer.setDebug(true);
                peer.isCall=true;
                peer.call();
                peerList[peer.peerId]=peer;                 
                peerListUpdatedHandler(peerList);
            });
            socket.on("askReconnect",peerName=>{
                console.log("Receive askReconnect Event from "+peerName+".");
            });            
            socket.on("removePeerIdList",list=>{
                if (list.length>0){
                    console.log("Receive remove id List:"+JSON.stringify(list));
                    list.forEach(removePeerId=>{
                        delete peerList[removePeerId];
                    });
                    peerListUpdatedHandler(peerList);    
                }
            });
            socket.io.on("reconnect", () => {
                console.log("Reconnect successed.");
                socket.emit("reconnectRequest",{ peerId: peerId, peerName: peerName });
            });
            socket.on("signalData",signalObj=>{
                console.log("====Receive Signal Event Start====");
                let peer=peerList[signalObj.from];
                if (peer){
                    peer.signal(signalObj);
                }
                console.log("====Receive Signal Event End====");
            })
            socket.emit("hi",peerName, response => {
                peerId=response.peerId;
                let tempPeerList=response.peerList;
                console.log("====Sent Hi Response Start====");
                console.log("peerId:"+peerId);
                console.log("====Peer list====");
                for (const [newPeerId, tempPeer] of Object.entries(tempPeerList)) {
                    let peer=new Peer(newPeerId,tempPeer.peerName);
                    peer.on("signal",signalData=>{
                        let temp={from:peerId,to:peer.peerId,signalData};
                        socket.emit("signal",temp);
                    });
                    peer.setDebug(true);
                    peer.setConfig(webRtcConfig);
                    peerList[peer.peerId]=peer;
                }
                console.log(peerList);
                peerListUpdatedHandler(peerList);
                console.log("====Sent Hi Response End====");
            });            
        }
        this.disconnect=()=>{
            Object.values(peerList).forEach(peer=>{
                peer.hangUp();
            })
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