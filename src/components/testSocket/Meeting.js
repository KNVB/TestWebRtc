import io from "socket.io-client";
import Peer from './Peer';
export default class Meeting {
    constructor() {
        let isDebug = false;
        let localPeerId;
        let localStream;
        let peerList = {};
        let peerName;
        let setInitMeetingEventHandler, newPeerEventHandler;
        let peerReconnectEventHandler;
        let refreshSocketIdEventHandler, removePeerEventHandler;
        let signalServerURL = "";
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
        /*=====================================================================*/
        /*        Connect to Signal Server                                     */
        /*=====================================================================*/
        this.connect = () => {
            socket = io(signalServerURL, {
                transports: ["websocket"],
            });
            /*=====================================================================*/
            /*        To handler for varies socket event                           */
            /*=====================================================================*/
            socket.on("connect", () => {
                const engine = socket.io.engine;
                msgLogger("Connection to Signal server established.");
                socket.on("disconnect", reason => {
                    msgLogger("socket disconnect event occur:" + reason);
                });
                socket.on("newPeer", (newPeer) => {
                    msgLogger("newPeer event recevied");
                    msgLogger(newPeer);
                    let peer = new Peer(newPeer.name, newPeer.peerId);
                    peer.isCall = true;
                    peer.setWebRTCConfig(webRtcConfig);
                    if (localStream){
                        peer.setStream(localStream);
                    }
                    peerList[newPeer.peerId] = peer;
                    if (newPeerEventHandler) {
                        newPeerEventHandler(peer);
                    }
                });
                socket.on("peerReconnect", peerId => {
                    msgLogger("Peer Reconnect:" + peerId);
                    peerList[peerId].restartICE();
                    //console.log("Peer " + items.peerList[peerId].name + " Reconnect");
                    //setItem({ type: "peerReconnect", "peerId": peerId });
                    if (peerReconnectEventHandler) {
                        peerReconnectEventHandler(peerList[peerId]);
                    }
                });
                socket.on("removePeerIdList", (peerIdList) => {
                    msgLogger("removePeerIdList event received.");
                    msgLogger(peerIdList);
                    peerIdList.forEach(peerId => {
                        delete peerList[peerId];
                    })

                    if (removePeerEventHandler) {
                        removePeerEventHandler(peerIdList);
                    }
                });
                socket.io.on("reconnect", () => {
                    msgLogger("Reconnect successed.");
                    socket.emit("refreshSocketId", localPeerId, response => {
                        if (refreshSocketIdEventHandler) {
                            refreshSocketIdEventHandler(response);
                        }
                        /*
                        if (response.result === false) {
                            alert(response.message);
                        }
                        */
                    });
                });
                socket.on('signalData', signalData => {
                    msgLogger("Receive SignalData");
                    msgLogger(signalData);
                    let peer = peerList[signalData.from];
                    if (peer) {
                        peer.signal(signalData.signalContent);
                    }
                });
                engine.on("close", reason => {
                    // called when the underlying connection is closed
                    msgLogger("Engine Close event occured:" + reason);
                });
            });
        }
        /*=====================================================================*/
        /*        To join the meeting                                          */
        /*=====================================================================*/
        this.join = (pn) => {
            peerName = pn;
            join();
        }
        this.leave = () => {
            Object.values(peerList).forEach(peer=>{
                peer.hangUp();
            })
            socket.disconnect();
        }
        /*=====================================================================*/
        /*        To configure handler for varies event handler                */
        /*=====================================================================*/
        this.on = (eventType, handler) => {
            switch (eventType) {
                case "initMeeting":
                    setInitMeetingEventHandler = handler;
                    break;
                case "newPeer":
                    newPeerEventHandler = handler;
                    break;
                case "peerReconnect":
                    peerReconnectEventHandler = handler;
                    break;
                case "removePeer":
                    removePeerEventHandler = handler;
                    break;
                case "refreshSocketId":
                    refreshSocketIdEventHandler = handler;
                    break;
                default:
                    break;
            }
        }
        /*=====================================================================*/
        /*        To send signal data to remote peer                           */
        /*=====================================================================*/
        this.sendSignalData = (signalData) => {
            socket.emit("sendSignalData", {
                to: signalData.to,
                from: localPeerId,
                signalContent: signalData.signalContent
            });
            //socket.emit("sendSignalData", signalData);
        }
        /*=====================================================================*/
        /*        To control if message error is shown                         */
        /*=====================================================================*/
        this.setDebug = (debug) => {
            isDebug = debug;
        }
        /*=====================================================================*/
        /*       The local stream setter                                       */
        /*=====================================================================*/
        this.setLocalStream = (stream) => {
            localStream=stream;
            for (const [peerId, peer] of Object.entries(peerList)){
                if (peerId === localPeerId){
                    peer.stream(stream);
                }else {
                    peer.setStream(stream);
                }
            }
        }
        /*=====================================================================*/
        /*        Set the signal server url                                    */
        /*=====================================================================*/
        this.setSignalServerURL = (url) => {
            signalServerURL = url;
        }
        /*=======================================================*/
        /*      Private Method                                   */
        /*=======================================================*/
        /*=======================================================*/
        /*      Join the meeting                                 */
        /*=======================================================*/
        let join = () => {
            socket.emit("hi", peerName, response => {
                localPeerId = response.peerId;
                let temp = {};
                for (const [peerId, peerInfo] of Object.entries(response.peerList)) {
                    let peer = new Peer(peerInfo.name, peerId);
                    peer.setWebRTCConfig(webRtcConfig);
                    peer.isCall = false;
                    temp[peerId] = peer;
                };
                peerList = temp;
                if (setInitMeetingEventHandler) {
                    setInitMeetingEventHandler(localPeerId, peerList);
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