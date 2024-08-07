import WebRTC from './WebRTC';
/**
 * A Peer object
 * @date 8/18/2023 - 10:30:28 AM 
 */
class Peer {
    #connectionState = '';
    #connectionStateChangeHandler;
    #dataChannelMessageHandler;
    #ignoreOffer = false; #isDebug = false;
    #makingOffer = false; #polite = false;
    #signalEventHandler; #streamHandler;
    #webRTC = new WebRTC();
    constructor() {
        this.isCall = false;
        this.isLocalPeer = false;
        this.peerName = '';
        this.peerId = '';

        this.#webRTC.on("dataChannelClose", () => {
            this.#msgLogger("====Data channel close start====");
            this.#msgLogger("Peer " + this.peerName + " data channel is closed.");
            this.#msgLogger("====Data channel close end====");
        });
        this.#webRTC.on("dataChannelError", (event) => {
            this.#msgLogger("====Data channel error start====");
            this.#msgLogger("An error occured in Peer " + this.peerName + " data channel:");
            this.#msgLogger(event);
            this.#msgLogger("====Data channel error end====");
        });
        this.#webRTC.on("dataChannelMessage", message => {
            this.#dataChannelMessageHandler(message.data);
        });
        this.#webRTC.on("dataChannelOpen", () => {
            this.#msgLogger("====Data channel open start====");
            this.#msgLogger("Peer " + this.peerName + " data channel is opened.");
            this.#msgLogger("====Data channel open end====");
        });

        this.#webRTC.on("iceCandidate", candidate => {
            if (candidate) {
                this.#signalEventHandler({ type: "iceCandidate", value: candidate });
            } else {
                this.#msgLogger("All ICE candidates are sent to " + this.peerName);
            }
        });
        this.#webRTC.on("iceConnectionStateChange", iceConnectionState => {
            this.#msgLogger("====ICE Conntection State Change Start====");
            this.#msgLogger("Peer:" + this.peerName + ",ICE Conntection state chanaged to " + iceConnectionState);
            this.#msgLogger("=====ICE Conntection State Change End====");
            this.#connectionState = iceConnectionState;
            if (this.#connectionStateChangeHandler) {
                this.#connectionStateChangeHandler(iceConnectionState);
            }
        });
        this.#webRTC.on("iceGatheringStateChange", iceGatheringState => {
            this.#msgLogger("====ICE Gathering State Change Start=====");
            this.#msgLogger("Peer:" + this.peerName + ",ICE Gathering State=" + iceGatheringState);
            this.#msgLogger("====ICE Gathering State Change End====");
        });

        this.#webRTC.on("negotiation", async () => {
            this.#msgLogger("====Negotiation start====");
            this.#msgLogger("Peer:" + this.peerName);
            try {
                this.#makingOffer = true;
                await this.#webRTC.setLocalDescription();
                this.#signalEventHandler({ "type": "remoteDescription", "value": this.#webRTC.getLocalDescription() });
                this.#msgLogger("Sent local Description to " + this.peerName);
            } catch (err) {
                this.#msgLogger("Failed to send Local Description:" + err);
            } finally {
                this.#makingOffer = false;
                this.#msgLogger("====Negotiation end====");
            }
        });
        this.#webRTC.on("peerConnectionStateChange", peerConnectionState => {
            this.#msgLogger("====Peer Conntection State Change Start====");
            this.#msgLogger("Peer:" + this.peerName + " conntection state changed to " + peerConnectionState);
            this.#msgLogger("=====Peer Conntection State Change End====");
            this.#connectionState = peerConnectionState;
            if (this.#connectionStateChangeHandler) {
                this.#connectionStateChangeHandler(peerConnectionState);
            }
        });
        this.#webRTC.on("signalingStateChange", signalingState => {
            this.#msgLogger("====Signaling State Change Start====");
            this.#msgLogger("Peer:" + this.peerName + ",signalingState=" + signalingState);
            this.#msgLogger("====Signaling State Change End====");
        });

        this.#webRTC.on("stream", stream => {
            this.#msgLogger("====Receive Stream Start====");
            this.#msgLogger("Receive Stream From Peer:" + this.peerName);
            this.#msgLogger("====Receive Stream End====");
            if (this.#streamHandler) {
                this.#streamHandler(stream);
            }
        });
        this.#webRTC.setDebug(true);
    }
    /**
     * Make a call to this Peer
     */
    call() {
        this.#polite = true;
        this.#msgLogger("Make a call to " + this.peerName);
        this.#webRTC.call();
    }
    /**
     * Get the connection state
     * @returns {string} connection state
     */
    getConnectionState() {
        return this.#connectionState;
    }
    /**
     * Hangup the peer connection
     */
    hangUp() {
        this.#webRTC.hangUp();
    }
    /**
     * Initialize the WebRTC object
     */
    init() {
        this.#webRTC.init();
    }
    /**
     * To configure handler for various peer events
     * @date 8/18/2023 - 9:56:30 AM
     *
     * @param {string} eventType Event Type
     * @param {function} handler Event handler
     */
    on(eventType, handler) {
        switch (eventType) {
            case "connectionStateChange":
                this.#connectionStateChangeHandler = handler;
                break;
            case "signal":
                this.#signalEventHandler = handler;
                break;
            case "dataChannelMessage":
                this.#dataChannelMessageHandler = handler;
                break;
            case "stream":
                this.#streamHandler = handler;
                break;
            default: break;
        }
    }
    /**
     * Restart ICE
     */
    restartICE() {
        this.#webRTC.restartICE();
    }
    /**
     * Sending data to the remote peer via the WebRTC connection.
     * @param {object} data 
     */
    sendMessage(data) {
        this.#webRTC.send(data);
    }
    /**
    * Set the Web RTC configuration
    * @date 8/18/2023 - 10:00:52 AM
    *
    * @param {object} config
    */
    setConfig(config) {
        this.#webRTC.setConfig(config);
    }
    /**
    * To control if message error is shown.
    * @param {boolean} debug If true show the error message in console, else do not.
    */
    setDebug(debug) {
        this.#isDebug = debug;
    }
    /**
     * Add a media stream to a peer
     * @param {MediaStream} stream 
     */
    setStream(stream) {
        this.#webRTC.setStream(stream);
    }
    /**
     * To process the signal data   
     * @param {object} signalObj 
     */
    signal(signalObj) {
        this.#msgLogger("====Process Signal Data Start====");
        this.#msgLogger("Receive " + signalObj.type + " from " + this.peerName);
        switch (signalObj.type) {
            case "iceCandidate":
                try {
                    this.#webRTC.addICECandidate(signalObj.value);
                } catch (err) {
                    if (!this.#ignoreOffer) {
                        throw err;
                    }
                }
                break;
            case "remoteDescription":
                this.#processRemoteDescription(signalObj.value)
                break;
            default:
                break;
        }
        this.#msgLogger("====Process Signal Data end====");
    }
    /*========================================================================================*/
    /*      Private Method                                                                    */
    /*========================================================================================*/
    /**
     * Message Logger
     * @param {string} msg 
     */
    #msgLogger = (msg) => {
        if (this.#isDebug) {
            console.log(msg);
        }
    }
    #processRemoteDescription = async (signalData) => {
        this.#msgLogger("====processRemoteDescription Start====");
        const offerCollision = (signalData.type === "offer") &&
            (this.#makingOffer || this.#webRTC.getSignalingState() !== "stable");
        this.#ignoreOffer = !this.#polite && offerCollision;
        this.#msgLogger("signalData.type=" + signalData.type + ",makingOffer=" + this.#makingOffer + ", webRTC.getSignalingState()=" + this.#webRTC.getSignalingState());
        this.#msgLogger("ignoreOffer = " + this.#ignoreOffer + ",offerCollision=" + offerCollision + ",polite=" + this.#polite);
        if (this.#ignoreOffer) {
            this.#msgLogger("Ignore offer from " + this.peerName);
            return;
        }

        try {
            await this.#webRTC.setRemoteDescription(signalData);
        } catch (error) {
            this.#msgLogger("Signaling State=" + this.#webRTC.getSignalingState());
            this.#msgLogger("An error occur when setting remote description.");
            this.#msgLogger(error);
        }

        if (signalData.type === "offer") {
            try {
                await this.#webRTC.setLocalDescription();
                this.#signalEventHandler({ "type": "remoteDescription", "value": this.#webRTC.getLocalDescription() });
                this.#msgLogger("Sent local Description to " + this.peerName);
            } catch (error) {
                this.#msgLogger("Signaling State=" + this.#webRTC.getSignalingState());
                this.#msgLogger("An error occur when setting local description.");
                this.#msgLogger(error);
            }
        }
        this.#msgLogger("====processRemoteDescription End====");
    }
}
export default Peer;