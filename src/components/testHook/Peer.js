import WebRTC from './WebRTC';
export default class Peer {
    constructor() {
        let connectionState = '';
        let connectionStateChangeHandler;
        let dataChannelMessageHandler;
        let ignoreOffer = false, isDebug = false;
        let makingOffer = false, polite = false;
        let peerName = '', peerId = '';
        let signalEventHandler, streamHandler;
        let webRTC = new WebRTC();

        this.isCall = false;
        this.isLocalPeer = false;

        webRTC.on("dataChannelClose", () => {
            msgLogger("====Data channel close start====");
            msgLogger("Peer " + peerName + " data channel is closed.");
            msgLogger("====Data channel close end====");
        });
        webRTC.on("dataChannelError", (event) => {
            msgLogger("====Data channel error start====");
            msgLogger("An error occured in Peer " + peerName + " data channel:");
            msgLogger(event);
            msgLogger("====Data channel error end====");
        });
        webRTC.on("dataChannelMessage", message => {
            dataChannelMessageHandler(message.data);
        });
        webRTC.on("dataChannelOpen", () => {
            msgLogger("====Data channel open start====");
            msgLogger("Peer " + peerName + " data channel is opened.");
            msgLogger("====Data channel open end====");
        });

        webRTC.on("iceCandidate", candidate => {
            if (candidate) {
                signalEventHandler({ type: "iceCandidate", value: candidate });
            } else {
                msgLogger("All ICE candidates are sent to " + peerName);
            }
        });
        webRTC.on("iceConnectionStateChange", iceConnectionState => {
            msgLogger("====ICE Conntection State Change Start====");
            msgLogger("Peer:" + peerName + ",ICE Conntection state chanaged to " + iceConnectionState);
            msgLogger("=====ICE Conntection State Change End====");
            connectionState = iceConnectionState;
            if (connectionStateChangeHandler) {
                connectionStateChangeHandler(iceConnectionState);
            }
        });
        webRTC.on("iceGatheringStateChange", iceGatheringState => {
            msgLogger("====ICE Gathering State Change Start=====");
            msgLogger("Peer:" + peerName + ",ICE Gathering State=" + iceGatheringState);
            msgLogger("====ICE Gathering State Change End====");
        });

        webRTC.on("negotiation", async () => {
            msgLogger("====Negotiation start====");
            msgLogger("Peer:" + peerName);
            try {
                makingOffer = true;
                await webRTC.setLocalDescription();
                signalEventHandler({ "type": "remoteDescription", "value": webRTC.getLocalDescription() });
                msgLogger("Sent local Description to " + peerName);
            } catch (err) {
                msgLogger("Failed to send Local Description:" + err);
            } finally {
                makingOffer = false;
                msgLogger("====Negotiation end====");
            }
        });
        webRTC.on("peerConnectionStateChange", peerConnectionState => {
            msgLogger("====Peer Conntection State Change Start====");
            msgLogger("Peer:" + peerName + " conntection state changed to " + peerConnectionState);
            msgLogger("=====Peer Conntection State Change End====");
            connectionState = peerConnectionState;
            if (connectionStateChangeHandler) {
                connectionStateChangeHandler(peerConnectionState);
            }
        });
        webRTC.on("signalingStateChange", signalingState => {
            msgLogger("====Signaling State Change Start====");
            msgLogger("Peer:" + peerName + ",signalingState=" + signalingState);
            msgLogger("====Signaling State Change End====");
        });

        webRTC.on("stream", stream => {
            msgLogger("====Receive Stream Start====");
            msgLogger("Receive Stream From Peer:" + peerName);
            msgLogger("====Receive Stream End====");
            if (streamHandler) {
                streamHandler(stream);
            }
        });

        webRTC.setDebug(true);

        /*=====================================================================*/
        /*        Initialize the WebRTC object                                 */
        /*=====================================================================*/
        this.init = () => {
            webRTC.init();
        }
        /*=====================================================================*/
        /*        Get Peer connection state                                    */
        /*=====================================================================*/
        this.getConnectionState = () => {
            return connectionState;
        }
        this.getPeerName = () => {
            return peerName;
        }
        this.getPeerId = () => {
            return peerId;
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
        this.setPeerId = (id) => {
            peerId = id;
        }
        this.setPeerName = (pn) => {
            console.log("setPeerName method is called.");
            peerName = pn;
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
    }
}