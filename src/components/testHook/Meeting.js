import io from 'socket.io-client';
import Peer from "./Peer";

export default class Meeting {
    constructor() {
        let connectionTimeoutHandler;
        let globalMessageHandler;
        let initPeerListHandler;
        let localPeer = new Peer();
        let localStream;
        let peerList = null;
        let peerListUpdatedHandler;
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
        console.log("Meeting Object constructor is called.");
        /*=====================================================================*/
        /*        Get peer list                                                */
        /*=====================================================================*/
        this.getPeerList = () => {
            return peerList;
        }
        this.getLocalPeerName = () => {
            return localPeer.getPeerName();
        }
        this.join = path => {
            socket = io(path, {
                transports: ["websocket"],
            });
            socket.emit("hi", this.getLocalPeerName(), response => {
                console.log("====Sent Hi Response Start====");
                console.log("response:" + JSON.stringify(response));
                let tempList={};
                for (const [newPeerId, tempPeer] of Object.entries(response.peerList)) {
                    let peer = genPeer(newPeerId, tempPeer.peerName);
                    tempList[peer.peerId] = peer;
                }
                initPeerListHandler({"localPeerId":response.peerId,"peerList":tempList});
                console.log("====Sent Hi Response End====");
            });
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
                case "peerListUpdated":
                    peerListUpdatedHandler = param;
                    break;
                default: break;
            }
        }
        this.setLocalPeerId = peerId => {
            localPeer.setPeerId(peerId);
        }
        this.setLocalPeerName = peerName => {
            localPeer.setPeerName(peerName);
        }
        this.setPeerList = pl => {
            peerList=pl;
        }
        /*=====================================================================*/
        /*        Add a local media stream to a local variable for future use  */
        /*=====================================================================*/
        this.setLocalStream = stream => {
            setLocalStream(stream);
        }
        /*========================================================================================*/
        /*      Private Method                                                                    */
        /*========================================================================================*/
        /*  To generate an Peer instance                                                          */
        /*========================================================================================*/
        let genPeer = (newPeerId, peerName) => {
            let peer = new Peer(), temp;
            peer.setPeerName(peerName);
            peer.setPeerId(newPeerId);
            peer.on("signal", signalData => {
                temp = { from: localPeer.peerId, to: peer.peerId, signalData };
                sendSignalData(temp);
            });
            peer.on("dataChannelMessage", message => {
                globalMessageHandler({ from: peerName, message: message });
            });
            /*
            peer.on("dataChannelMessage", message => {
                console.log("==== Message received from " + peerName + " start====");
                console.log(message);
                console.log("==== Message received from " + peerName + " end====");
            });
            */
            if (localStream) {
                peer.setStream(localStream);
            }
            peer.setConfig(webRtcConfig);
            peer.setDebug(true);
            peer.init();
            return peer;
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
                        console.log("The destination peer does not exist.");
                        break;
                    default:
                        break;
                }
            });
        }
        /*=====================================================================*/
        /*        Add a local media stream to all peer in the peer list        */
        /*=====================================================================*/
        let setLocalStream = (stream) => {
            localStream = stream;
            Object.values(peerList).forEach(peer => {
                peer.setStream(localStream);
            })
        }
    }
}