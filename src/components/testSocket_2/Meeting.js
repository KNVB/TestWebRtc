import io from "socket.io-client";
import Peer from './Peer';
export default class Meeting {
    constructor() {
        let peerName;
        let setPeerListEventHandler, newPeerEventHandler, removePeerEventHandler;
        let peerList = {};
        let isDebug = false;

        let socket = null;
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
        let webSocketServerURL = "";

        /*=====================================================================*/
        /*        Connect to Web Socket Server                                 */
        /*=====================================================================*/
        this.connect = () => {
            socket = io(webSocketServerURL, {
                transports: ["websocket"],
            });
            /*=====================================================================*/
            /*        To handler for varies socket event                           */
            /*=====================================================================*/
            socket.on("newPeer", (newPeer) => {
                let peer = new Peer(newPeer.name, newPeer.socketId);
                peerList[newPeer.socketId] = peer;
                if (newPeerEventHandler) {
                    newPeerEventHandler(peer);
                }
            });
            socket.on("removePeer", (socketId) => {
                delete peerList[socketId];
                if (removePeerEventHandler) {
                    removePeerEventHandler(socketId);
                }
            });
            socket.on("signalData", param => {
                let remotePeer = peerList[param.from];
                msgLogger("Receive signal Data From:" + remotePeer.name);
                remotePeer.signal(param.signalData);
            });
        }
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
                    newPeerEventHandler = handler;
                    break;
                case "setPeerList":
                    setPeerListEventHandler = handler;
                    break;
                case "removePeer":
                    removePeerEventHandler = handler;
                    break;
                default:
                    break;
            }
        }
        /*=====================================================================*/
        /*        To send signal data to remote peer                           */
        /*=====================================================================*/
        this.sendSignalData = (signalData) => {
            socket.emit("sendSignalData", signalData);
        }
        /*=====================================================================*/
        /*       The local stream setter                                       */
        /*=====================================================================*/
        this.setLocalStream = (stream) => {
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
        this.setDebug = (debug) => {
            isDebug = debug;
        }
        /*=====================================================================*/
        /*        Set the Web RTC configuration                                */
        /*=====================================================================*/
        this.setWebRTCConfig = (config) => {
            webRtcConfig = config;
        }
        /*=====================================================================*/
        /*        Set the web socket server url                                */
        /*=====================================================================*/
        this.setWebSocketServerURL = (url) => {
            webSocketServerURL = url;
        }

        /*=======================================================*/
        /*      Private Method                                   */
        /*=======================================================*/
        let join = () => {
            socket.emit("hi", peerName, (response) => {
                peerList = {};
                Object.keys(response.peerList).forEach(socketId => {
                    let peer = new Peer(response.peerList[socketId].name, socketId);
                    peer.on("connect", () => {
                        msgLogger("Connection to " + peer.name + " is established.");
                    });
                    peer.setWebRTCConfig(webRtcConfig);
                    peerList[socketId] = peer;
                });
                if (setPeerListEventHandler) {
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