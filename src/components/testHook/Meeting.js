import Peer from './Peer';
import io from 'socket.io-client';
export default class Meeting {
    constructor() {
        let connectionTimeoutHandler;
        let globalMessageHandler;
        let initPeerListHandler;
        let isDebug = false;
        let newPeerEventHandler;
        let reconnectEventHandler;
        let removePeerIdHandler;
        let signalHandler;
        let socket = null;
        let webRtcConfig = {
            iceServers: [
                {
                    urls: "turn:numb.viagenie.ca",
                    credential: "turnserver",
                    username: "sj0016092@gmail.com",
                },
                {
                    urls: ["turn:openrelay.metered.ca:443?transport=tcp"],
                    username: "openrelayproject",
                    credential: "openrelayproject",
                },
                {
                    urls: "turn:numb.viagenie.ca",
                    credential: "turnserver",
                    username: "sj0016092@gmail.com",
                },
                {
                    urls: [
                        "stun:stun.l.google.com:19302",
                        "stun:stun1.l.google.com:19302",
                        "stun:stun2.l.google.com:19302",
                        "stun:stun3.l.google.com:19302",
                        "stun:stun4.l.google.com:19302",
                    ]
                },
            ]
            /*
            iceServers: [
                { urls: "stun:stun.stunprotocol.org" },
                { urls: "stun:stun.l.google.com:19302" },
                { urls: "stun:stun1.l.google.com:19302"},
                { urls: "stun:stun2.l.google.com:19302"},
                {
                    urls: "turn:numb.viagenie.ca",
                    credential: "turnserver",
                    username: "sj0016092@gmail.com",
                },
            ],
            */
        };
        

        this.join = (path, localPeer) => {
            socket = io(path, {
                transports: ["websocket"],
            });
            socket.io.on("reconnect", () => {
                msgLogger("==========Reconnect successed start=============");
                socket.emit("reconnectRequest", localPeer, response => {
                    switch (response.status) {
                        case 1:
                            connectionTimeoutHandler("Connection time out, please connect the meeting again.");
                            break;
                        default:
                            break;
                    }
                });
                msgLogger("==========Reconnect successed end=============");
            });
            socket.on("askConnect", newPeer => {
                msgLogger("====Receive Hi Start====");
                msgLogger("Receive Hi Event from " + JSON.stringify(newPeer) + ".");
                let peer = genPeer(localPeer.getPeerId(), newPeer.peerId, newPeer.peerName);
                peer.isCall = true;
                peer.call();
                newPeerEventHandler(peer);
                msgLogger("====Receive Hi End====");
            });
            socket.on("askReconnect", reconnectPeerId => {
                msgLogger("==================Receive askReconnect Event from " + reconnectPeerId + "start ==========");
                reconnectEventHandler(reconnectPeerId);
                msgLogger("==================Receive askReconnect Event from " + reconnectPeerId + "end ==========");
            });
            socket.on("removePeerIdList", list => {
                msgLogger("====Receive Remove Peer Id List start====");
                msgLogger("remove id list:" + JSON.stringify(list))
                if (list.length > 0) {
                    removePeerIdHandler(list)
                }
                msgLogger("====Receive Remove Peer Id List end====");
            });
            socket.on("signalData", signalObj => {
                msgLogger("====Receive Signal Event Start====");
                msgLogger("signalObj:" + JSON.stringify(signalObj));
                signalHandler(signalObj);
                msgLogger("====Receive Signal Event End====");
            })
            socket.emit("hi", localPeer.getPeerName(), response => {
                msgLogger("====Sent Hi Response Start====");
                msgLogger("response:" + JSON.stringify(response));
                let tempList = [];
                for (const [newPeerId, tempPeer] of Object.entries(response.peerList)) {
                    let peer = genPeer(response.peerId, newPeerId, tempPeer.peerName);
                    tempList.push(peer);
                }
                initPeerListHandler({ "localPeerId": response.peerId, "peerList": tempList });
                msgLogger("====Sent Hi Response End====");
            });
        }
        this.leave = () => {
            if (socket) {
                socket.disconnect();
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
                    break;
                case "initPeerList":
                    initPeerListHandler = param;
                    break;
                case "newPeerEvent":
                    newPeerEventHandler = param;
                    break;
                case "reconnectEvent":
                    reconnectEventHandler = param;
                    break;
                case "removePeerId":
                    removePeerIdHandler = param;
                    break;
                case "signal":
                    signalHandler = param;
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
        /*========================================================================================*/
        /*      Private Method                                                                    */
        /*========================================================================================*/
        /*  To generate an Peer instance                                                          */
        /*========================================================================================*/
        let genPeer = (localPeerId, newPeerId, peerName) => {
            let peer = new Peer(), temp;
            peer.setPeerName(peerName);
            peer.setPeerId(newPeerId);
            peer.on("signal", signalData => {
                temp = { from: localPeerId, to: peer.getPeerId(), signalData };
                sendSignalData(temp);
            });
            peer.on("dataChannelMessage", message => {
                //msgLogger("dataChannelMessage:"+message);
                globalMessageHandler(JSON.parse(message));
            });
            /*
            peer.on("dataChannelMessage", message => {
                msgLogger("==== Message received from " + peerName + " start====");
                msgLogger(message);
                msgLogger("==== Message received from " + peerName + " end====");
            });
            */
            peer.setConfig(webRtcConfig);
            peer.setDebug(true);
            peer.init();
            return peer;
        }
        /*=====================================================================*/
        /*        Message Logger                                               */
        /*=====================================================================*/
        let msgLogger = (msg) => {
            if (isDebug) {
                console.log(msg);
            }
        }
        /*========================================================================================*/
        /*  To send a signal data to remote peer                                                  */
        /*========================================================================================*/
        let sendSignalData = (signalData) => {
            socket.emit("signal", signalData, response => {
                switch (response.status) {
                    case 1:
                        connectionTimeoutHandler("Connection time out, please connect the meeting again.");
                        break;
                    case 2:
                        msgLogger("The destination peer does not exist.");
                        break;
                    default:
                        break;
                }
            });
        }
        msgLogger("Meeting Object constructor is called.");
    }
}