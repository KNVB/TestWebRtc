import io from "socket.io-client";
import Peer from './Peer';
export default class Meeting {
    constructor() {
        let peerName;
        let setPeerListEventHandler, newPeerEventHandler, removePeerEventHandler;
        let peerList = {};
        let isDebug=false;

        let socket = io(process.env.REACT_APP_SOCKET_URL + "a", {
            transports: ["websocket"],
        });
        /*=====================================================================*/
        /*        To handler for varies socket event                           */
        /*=====================================================================*/
        socket.on("newPeer", (newPeer) => {
            let peer = new Peer(newPeer.name, newPeer.socketId);
            peerList[newPeer.socketId]=peer;
            if (newPeerEventHandler){
                newPeerEventHandler(peer);
            }
        });
        socket.on("removePeer", (socketId) => {
            delete peerList[socketId];
            if (removePeerEventHandler){
                removePeerEventHandler(socketId);
            }
        });
        socket.on("signalData",param=>{
            let remotePeer=peerList[param.from];
            msgLogger("Receive signal Data From:"+remotePeer.name);           
            remotePeer.signal(param.signalData);
        });
        /*=====================================================================*/
        /*        To join the meeting                                          */
        /*=====================================================================*/
        this.join = (pn) => {
            peerName = pn;
            join();
        }
        /*=====================================================================*/
        /*        To configure handler for varies event handler                */
        /*=====================================================================*/
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
        /*=====================================================================*/
        /*        To send signal data to remote peer                           */
        /*=====================================================================*/
        this.sendSignalData=(signalData)=>{
            socket.emit("sendSignalData",signalData);
        }
        /*=====================================================================*/
        /*       The local stream setter                                       */
        /*=====================================================================*/  
        this.setLocalStream=(stream)=>{
            Object.keys(peerList).forEach(socketId => {
                if (socketId !== socket.id) {
                  peerList[socketId].setStream(stream);
                } else {
                  peerList[socketId].stream(stream);
                }
              })
        }
        /*=====================================================================*/
        /*        To control if message error is shown                         */
        /*=====================================================================*/
        this.setDebug=(debug)=>{
            isDebug=debug;
        }
        /*=======================================================*/
        /*      Private Method                                   */
        /*=======================================================*/
        let join = () => {
            socket.emit("hi", peerName, (response) => {
                peerList = {};
                Object.keys(response.peerList).forEach(socketId=>{
                    let peer = new Peer(response.peerList[socketId].name, socketId);
                    peer.on("connect",()=>{
                        msgLogger("Connection to "+peer.name+" is established.");
                    });
                    peerList[socketId]=peer;
                });
                if (setPeerListEventHandler){
                    setPeerListEventHandler(peerList);
                }
            });
        }        
        /*=====================================================================*/                
        /*        Message Logger                                               */
        /*=====================================================================*/
        let msgLogger = (msg) => {
            if (isDebug) {
                console.log(msg);
            }
        }
    }
}