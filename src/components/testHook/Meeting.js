import io from 'socket.io-client';
export default class Meeting {
    constructor() {
        let connectionTimeoutHandler;
        let globalMessageHandler;
        let initPeerListHandler;
        let newPeerEventHandler;
        let reconnectEventHandler;
        let removePeerIdListEventHandler;
        let signalEventHandler;
        let updatePeerNameEventHandler;

        let isDebug = false;
        let socket = null;
        console.log("Meeting Object constructor is called.");
        this.join = (path, localPeer) => {
            socket = io(path, {
                transports: ["websocket"],
            });
            socket.io.on("reconnect", () => {
                console.log("Reconnect successed.");
                socket.emit("reJoinRequest", localPeer, response => {
                    switch (response.status) {
                        case 1:
                            connectionTimeoutHandler("Connection time out, please connect the meeting again.");
                            break;
                        default:
                            break;
                    }
                });
            });
            socket.emit("hi", localPeer.peerName, response => {
                msgLogger("====Receive Say Hi response start=========")
                initPeerListHandler(response);
                msgLogger("======Receive Say Hi response end=========")
            });
            socket.on("askConnect", newPeer => {
                msgLogger("====Receive Say Hi from " + newPeer.peerName + " start=========")
                newPeerEventHandler(newPeer);
                msgLogger("====Receive Say Hi from " + newPeer.peerName + " end===========")
            });
            socket.on("askReconnect", peer=>{
                msgLogger("====Receive reconnect event from "+peer.peerName + " start========");
                reconnectEventHandler(peer);
                msgLogger("====Receive reconnect event from "+peer.peerName + " end==========");
            });
            socket.on("globalMessage", msgObj => {
                msgLogger("====Receive Global Message start=========");
                globalMessageHandler(msgObj);
                msgLogger("====Receive Global Message start=========");
            })
            socket.on("removePeerIdList", list => {
                msgLogger("====Receive Remove Peer List Start====");
                msgLogger("list=" + list);
                removePeerIdListEventHandler(list);
                msgLogger("====Receive Remove Peer List End====");
            });
            socket.on("signalData", signalObj => {
                msgLogger("====Receive Signal Event Start====");
                signalEventHandler(signalObj);
                msgLogger("====Receive Signal Event End====");
            });
            socket.on("updatePeerName", peer=>{
                msgLogger("====Receive Peer Name Event Start====");
                updatePeerNameEventHandler(peer);
                msgLogger("====Receive Peer Name Event End====");
            });
        }
        this.leave = () => {
            if (socket) {
                socket.disconnect();
                socket = null;
            }
        }
        /*=====================================================================*/
        /*        To configure handler for varies event                        */
        /*=====================================================================*/
        this.on = (eventType, param) => {
            switch (eventType) {
                case "connectionTimeout":
                    connectionTimeoutHandler = param;
                    break;
                case "globalMessage":
                    globalMessageHandler = param;
                    break
                case "initPeerList":
                    initPeerListHandler = param;
                    break;
                case "newPeerEvent":
                    newPeerEventHandler = param;
                    break;
                case "reconnectEvent":
                    reconnectEventHandler = param;
                    break;
                case "removePeerIdList":
                    removePeerIdListEventHandler = param;
                    break;
                case "signalEvent":
                    signalEventHandler = param;
                    break;
                case "updatePeerNameEvent":
                    updatePeerNameEventHandler = param;
                    break;
                default: break;
            }
        }
        /*=====================================================================*/
        /*        To control if message error is shown                         */
        /*=====================================================================*/
        this.setDebug = (debug) => {
            isDebug = debug;
        }
        this.sendGlobalMessage = msgObj => {
            socket.emit("sendGlobalMessage", msgObj);
        }
        /*========================================================================================*/
        /*  To send a signal data to remote peer                                                  */
        /*========================================================================================*/
        this.sendSignalData = (signalData) => {
            socket.emit("signal", signalData, response => {
                switch (response.status) {
                    case 1:
                        connectionTimeoutHandler("Connection time out, please connect the meeting again.");
                        break;
                    case 2:
                        console.log("The destination peer does not exist.");
                        break;
                    default:
                        break;
                }
            });
        }
        this.updateLocalPeerName=(peerId,newName)=>{
            socket.emit("updatePeerName",{"peerId":peerId,"peerName":newName});
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