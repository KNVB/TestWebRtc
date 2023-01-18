import WebRTC from './WebRTC';
export default class Peer {
    constructor() {
        let connectionState = '';
        let connectionStateChangeHandler;
        let dataChannelMessageHandler;
        let ignoreOffer = false, isDebug = false;
        let makingOffer = false, polite = false;
        let signalEventHandler, streamHandler;
        let webRTC = new WebRTC();

        this.isLocalPeer = false;
        this.peerName = '';
        this.peerId = '';
        webRTC.on("dataChannelClose", () => {
            msgLogger("====Data channel close start====");
            msgLogger("Peer " + this.peerName + " data channel is closed.");
            msgLogger("====Data channel close end====");
        });
        webRTC.on("dataChannelError", (event) => {
            msgLogger("====Data channel error start====");
            msgLogger("An error occured in Peer " + this.peerName + " data channel:");
            msgLogger(event);
            msgLogger("====Data channel error end====");
        });
        webRTC.on("dataChannelMessage", message => {
            dataChannelMessageHandler(message.data);
        });
        webRTC.on("dataChannelOpen", () => {
            msgLogger("====Data channel open start====");
            msgLogger("Peer " + this.peerName + " data channel is opened.");
            msgLogger("====Data channel open end====");
        });

        webRTC.on("iceCandidate", candidate => {
            if (candidate) {
                signalEventHandler({ type: "iceCandidate", value: candidate });
            } else {
                msgLogger("All ICE candidates are sent to " + this.peerName);
            }
        });
        webRTC.on("iceConnectionStateChange", iceConnectionState => {
            msgLogger("====ICE Conntection State Change Start====");
            msgLogger("Peer:" + this.peerName + ",ICE Conntection state chanaged to " + iceConnectionState);
            msgLogger("=====ICE Conntection State Change End====");
            connectionState = iceConnectionState;
            if (connectionStateChangeHandler) {
                connectionStateChangeHandler(iceConnectionState);
            }
        });
        webRTC.on("iceGatheringStateChange", iceGatheringState => {
            msgLogger("====ICE Gathering State Change Start=====");
            msgLogger("Peer:" + this.peerName + ",ICE Gathering State=" + iceGatheringState);
            msgLogger("====ICE Gathering State Change End====");
        });

        webRTC.on("negotiation", async () => {
            msgLogger("====Negotiation start====");
            msgLogger("Peer:" + this.peerName);
            try {
                makingOffer = true;
                await webRTC.setLocalDescription();
                signalEventHandler({ "type": "remoteDescription", "value": webRTC.getLocalDescription() });
                msgLogger("Sent local Description to " + this.peerName);
            } catch (err) {
                msgLogger("Failed to send Local Description:" + err);
            } finally {
                makingOffer = false;
                msgLogger("====Negotiation end====");
            }
        });
        webRTC.on("peerConnectionStateChange", peerConnectionState => {
            msgLogger("====Peer Conntection State Change Start====");
            msgLogger("Peer:" + this.peerName + " conntection state changed to " + peerConnectionState);
            msgLogger("=====Peer Conntection State Change End====");
            connectionState = peerConnectionState;
            if (connectionStateChangeHandler) {
                connectionStateChangeHandler(peerConnectionState);
            }
        });
        webRTC.on("signalingStateChange", signalingState => {
            msgLogger("====Signaling State Change Start====");
            msgLogger("Peer:" + this.peerName + ",signalingState=" + signalingState);
            msgLogger("====Signaling State Change End====");
        });

        webRTC.on("stream", stream => {
            msgLogger("====Receive Stream Start====");
            msgLogger("Receive Stream From Peer:" + this.peerName);
            msgLogger("====Receive Stream End====");
            if (streamHandler) {
                streamHandler(stream);
            }
        });

        webRTC.setDebug(false);
        /*=====================================================================*/
        /*        Make a call to this peer                                     */
        /*=====================================================================*/
        this.call = () => {
            polite = true;
            msgLogger("Make a call to " + this.peerName);
            webRTC.call();
        }
        this.getConnectionState = () => {
            return connectionState;
        }
        /*=====================================================================*/
        /*        Hangup the peer connection                                   */
        /*=====================================================================*/
        this.hangUp = () => {
            webRTC.hangUp();
        }
        /*=====================================================================*/
        /*        Initialize the WebRTC object                                 */
        /*=====================================================================*/
        this.init = () => {
            webRTC.init();
        }

        /*=====================================================================*/
        /*        To configure handler for varies event                        */
        /*=====================================================================*/
        this.on = (eventType, param) => {
            switch (eventType) {
                case "connectionStateChange":
                    connectionStateChangeHandler = param;
                    break;
                case "signal":
                    signalEventHandler = param;
                    break;
                case "dataChannelMessage":
                    dataChannelMessageHandler = param;
                    break;
                case "stream":
                    streamHandler = param;
                    break;
                default: break;
            }
        }
        /*=====================================================================*/
        /*       Remove all tracks from the peer connection object             */
        /*=====================================================================*/
        this.removeAllTracks=()=>{
            webRTC.removeAllTracks();
        }
        /*=====================================================================*/
        /*        Restart ICE                                                  */
        /*=====================================================================*/
        this.restartICE = () => {
            webRTC.restartICE();
        }
        /*=====================================================================*/
        /*       Sends data across the data channel to the remote peer.        */
        /*=====================================================================*/
        this.sendMessage = (data) => {
            webRTC.send(data);
        }
        /*=====================================================================*/
        /*        Set the Web RTC configuration                                */
        /*=====================================================================*/
        this.setConfig = (config) => {
            webRTC.setConfig(config);
        }
        /*=====================================================================*/
        /*        To control if message error is shown                         */
        /*=====================================================================*/
        this.setDebug = (debug) => {
            isDebug = debug;
        }
        /*=====================================================================*/
        /*        Add a media stream to a peer                                 */
        /*=====================================================================*/
        this.setStream = stream => {
            webRTC.setStream(stream);
        }
        /*=====================================================================*/
        /*        To process the signal data                                   */
        /*=====================================================================*/
        this.signal = (signalObj) => {
            msgLogger("====Process Signal Data Start====");
            msgLogger("Receive " + signalObj.type + " from " + this.peerName);
            switch (signalObj.type) {
                case "iceCandidate":
                    try {
                        webRTC.addICECandidate(signalObj.value);
                    } catch (err) {
                        if (!ignoreOffer) {
                            throw err;
                        }
                    }
                    break;
                case "remoteDescription":
                    processRemoteDescription(signalObj.value)
                    break;
                default:
                    break;
            }
            msgLogger("====Process Signal Data end====");
        }
        /*========================================================================================*/
        /*      Private Method                                                                    */
        /*========================================================================================*/
        /*=====================================================================*/
        /*        Message Logger                                               */
        /*=====================================================================*/
        let msgLogger = (msg) => {
            if (isDebug) {
                console.log(msg);
            }
        }
        /*=====================================================================*/
        /*        To process the remote description                            */
        /*=====================================================================*/
        let processRemoteDescription = async (signalData) => {
            msgLogger("====processRemoteDescription Start====");
            const offerCollision = (signalData.type === "offer") &&
                (makingOffer || webRTC.getSignalingState() !== "stable");
            ignoreOffer = !polite && offerCollision;
            msgLogger("signalData.type=" + signalData.type + ",makingOffer=" + makingOffer + ", webRTC.getSignalingState()=" + webRTC.getSignalingState());
            msgLogger("ignoreOffer = " + ignoreOffer + ",offerCollision=" + offerCollision + ",polite=" + polite);
            if (ignoreOffer) {
                msgLogger("Ignore offer from " + this.peerName);
                return;
            }

            await webRTC.setRemoteDescription(signalData);
            if (signalData.type === "offer") {
                await webRTC.setLocalDescription();
                signalEventHandler({ "type": "remoteDescription", "value": webRTC.getLocalDescription() });
                msgLogger("Sent local Description to " + this.peerName);
            }
            msgLogger("====processRemoteDescription End====");
        }
    }
}