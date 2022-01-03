import WebRTC from './WebRTC';
export default class Peer {
    constructor(peerId, peerName) {
        let ignoreOffer = false, isDebug = false;
        let makingOffer = false, polite = false;
        let signalEventHandler;
        let webRTC = new WebRTC();

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
        //webRTC.on("dataChannelMessage",
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
            msgLogger("Peer:" + peerName + ",ICE Conntection State=" + iceConnectionState);
            msgLogger("=====ICE Conntection State Change End====");
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
            }
            msgLogger("====Negotiation end====");
        });

        webRTC.on("signalingStateChange", signalingState => {
            msgLogger("====Signaling State Change Start====");
            msgLogger("Peer:" + peerName + ",signalingState=" + signalingState);
            msgLogger("====Signaling State Change End====");
        });
        /*
        webRTC.on("stream",
        */
        webRTC.setDebug(true);

        this.call = () => {
            polite = true;
            msgLogger("Make a call to " + peerName);
            webRTC.call();
        }
        /*=====================================================================*/
        /*        Hangup the peer connection                                   */
        /*=====================================================================*/
        this.hangUp = () => {
            webRTC.hangUp();
        }
        this.init=()=>{
            webRTC.init();
        }
        this.isCall = false;
        this.peerName = peerName;
        this.peerId = peerId;
        /*=====================================================================*/
        /*        To configure handler for varies event                        */
        /*=====================================================================*/
        this.on = (eventType, param) => {
            switch (eventType) {
                case "signal":
                    signalEventHandler = param;
                    break;
                default: break;
            }
        }
        this.restartICE=()=>{
            webRTC.restartICE();
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
        /*        To process the signal data                                   */
        /*=====================================================================*/
        this.signal = (signalObj) => {
            console.log("Receive " + signalObj.type + " from " + peerName);
            switch (signalObj.type) {
                case "iceCandidate":
                    webRTC.addICECandidate(signalObj.value);
                    break;
                case "remoteDescription":
                    processRemoteDescription(signalObj.value)
                    break;
                default:
                    break;
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
        /*=====================================================================*/
        /*        To process the remote description                            */
        /*=====================================================================*/
        let processRemoteDescription = async (signalData) => {
            const offerCollision = (signalData.type === "offer") &&
                (makingOffer || webRTC.getSignalingState() !== "stable");
            ignoreOffer = !polite && offerCollision;
            msgLogger("ignoreOffer = " + ignoreOffer + ",offerCollision=" + offerCollision + ",polite=" + polite);
            if (ignoreOffer) {
                msgLogger("Ignore offer from " + peerName);
                return;
            }
            await webRTC.setRemoteDescription(signalData);
            msgLogger("Set Remote Description for " + peerName);
            if (signalData.type === "offer") {
                await webRTC.setLocalDescription();
                signalEventHandler({ "type": "remoteDescription", "value": webRTC.getLocalDescription() });
                msgLogger("Sent local Description to " + peerName);
            }
        }
    }
}