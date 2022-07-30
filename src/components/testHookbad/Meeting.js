import io from 'socket.io-client';

export default class Meeting {
    constructor() {
        let connectionTimeoutHandler;
        let globalMessageHandler;
        let initPeerListHandler;
        let newPeerEventHandler;
        let reJoinEventHandler;
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
            socket.emit("hi", localPeer.getPeerName(), response => {
                msgLogger("====Receive Say Hi response start=========")
                initPeerListHandler(response);
                msgLogger("======Receive Say Hi response end=========")
            });
            socket.on("askConnect", newPeer => {
                msgLogger("====Receive Say Hi from " + newPeer.peerName + " start=========")
                newPeerEventHandler(newPeer);
                msgLogger("====Receive Say Hi from " + newPeer.peerName + " end===========")
            });
            socket.on("askReconnect", peer => {
                msgLogger("====Receive rejoin event from "+peer.peerName + " start========");
                reJoinEventHandler(peer);
                msgLogger("====Receive rejoin event from "+peer.peerName + " end==========");
            });
            socket.on("globalMessage", msgObj => {
                msgLogger("====Receive Global Message start=========");
                globalMessageHandler(msgObj);
                msgLogger("====Receive Global Message start=========");
            })
            socket.io.on("reconnect", () => {
                msgLogger("====Reconnect to the meeting server start=========");
                socket.emit("reconnectRequest", localPeer, response => {
                    connectionTimeoutHandler(response);
                })
                msgLogger("====Reconnect to the meeting server end===========");
            });
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
            socket.on("updatePeerName", peer => {
                msgLogger("====Receive Up Date Peer Name Event Start====");
                updatePeerNameEventHandler(peer);
                msgLogger("====Receive Up Date Peer Name Event End======");
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
                    connectionTimeoutHandler=param;
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
                case "reJoinEvent":
                    reJoinEventHandler=param;                    
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
        this.sendGlobalMessage = msgObj => {
            socket.emit("sendGlobalMessage", msgObj);
        }
        this.sendSignalData = signalData => {
            let result = 0;
            socket.emit("signal", signalData, response => {
                result = response.status;
            });
            return result;
        }
        /*=====================================================================*/
        /*        To control if message error is shown                         */
        /*=====================================================================*/
        this.setDebug = (debug) => {
            isDebug = debug;
        }
        this.updateLocalPeerName = (peer) => {
            console.log(peer.peerName);
            if (socket !== null) {
                socket.emit("updatePeerName", peer);
            }
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