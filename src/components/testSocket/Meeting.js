import io from "socket.io-client";
import Peer from './Peer';
export default class Meeting {
    constructor() {
        let peerName;
        let setPeerListEventHandler, newPeerEventHandler, removePeerEventHandler;
        this.peerList = {};
        let socket = io(process.env.REACT_APP_SOCKET_URL + "a", {
            transports: ["websocket"],
        });
        socket.on("newPeer", (newPeer) => {
            let peer = new Peer(newPeer.name, newPeer.socketId);
            this.peerList[newPeer.socketId]=newPeer;
            if (newPeerEventHandler){
                newPeerEventHandler(peer);
            }
        });
        socket.on("removePeer", (socketId) => {
            delete this.peerList[socketId];
            if (removePeerEventHandler){
                removePeerEventHandler(socketId);
            }
        });
        this.join = (pn) => {
            peerName = pn;
            join();
        }
        this.on = (eventType, handler) => {
            switch (eventType) {
                case "newPeer":
                    newPeerEventHandler=handler;
                    break;
                case "setPeerList":
                    setPeerListEventHandler = handler;
                    break;
                case "removePeer":    
                    removePeerEventHandler=handler;
                    break;
                default:
                    break;
            }
        }
        /*=======================================================*/
        /*      Private Method                                   */
        /*=======================================================*/
        let join = () => {
            socket.emit("hi", peerName, (response) => {
                //console.log(response.peerList);
                //setItem({ type: "setPeerList", peerList: response.peerList });
                this.peerList = {};
                Object.keys(response.peerList).forEach(socketId=>{
                    let peer = new Peer(response.peerList[socketId].name, socketId);
                    this.peerList[socketId]=peer;
                });
                if (setPeerListEventHandler){
                    setPeerListEventHandler(this.peerList);
                }
            });
        }
    }
}