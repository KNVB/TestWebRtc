import Peer from './Peer';
import io from 'socket.io-client';
export default class Meeting {
    constructor() {
        let connectionTimeoutHandler;
        let globalMessageHandler;
        let initPeerListHandler;
        
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
        
        this.join = (path,localPeer) => {
            socket = io(path, {
                transports: ["websocket"],
            });
            socket.emit("hi", localPeer.getPeerName(), response => {
                console.log("====Sent Hi Response Start====");
                console.log("response:" + JSON.stringify(response));
                let tempList=[];
                for (const [newPeerId, tempPeer] of Object.entries(response.peerList)) {
                    let peer = genPeer(response.peerId,newPeerId, tempPeer.peerName);
                    tempList.push(peer);
                }
                initPeerListHandler({"localPeerId":response.peerId,"peerList":tempList});
                console.log("====Sent Hi Response End====");
            });
        }
        this.leave=()=>{
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
                case "peerListUpdated":
                    peerListUpdatedHandler = param;
                    break;
                default: break;
            }
        }
        /*========================================================================================*/
        /*      Private Method                                                                    */
        /*========================================================================================*/
        /*  To generate an Peer instance                                                          */
        /*========================================================================================*/
        let genPeer = (localPeerId,newPeerId, peerName) => {
            let peer = new Peer(), temp;
            peer.setPeerName(peerName);
            peer.setPeerId(newPeerId);
            peer.on("signal", signalData => {
                temp = { from: localPeerId, to: peer.peerId, signalData };
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
    }
}