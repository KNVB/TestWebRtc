/**
 * A wrapper class of RTCPeerConnection
 * @date 8/18/2023 - 10:30:28 AM 
 */
export default class WebRTC {
    private configuration = {};
    private dataChannel: RTCDataChannel;
    private dataChannelCloseHandler: any;
    private dataChannelErrorHandler: any;
    private dataChannelMessageHandler: any;
    private dataChannelOpenHandler: any;
    private iceCandidateEventHandler: any;
    private iceConnectionStateChangeHandler: any;
    private iceGatheringStateChangeHandler: any;
    private isDebug = false;
    private localStream: MediaStream;
    private negotiationHandler: any;
    private peerConnection: RTCPeerConnection;
    private peerConnectionStateChangeHandler: any;
    private signalingStateChangeHandler: any;
    private trackEventHandler: any;

    /**
     * Add ICE Candidate to the Peer Connection object
     * @async
     * @param {RTCIceCandidate} iceCandidate An RTCIceCandidate object.
     */
    async addICECandidate(iceCandidate: RTCIceCandidate) {
        if (this.peerConnection.connectionState !== "closed") {
            await this.peerConnection.addIceCandidate(iceCandidate);
        }
    }

    /**
     *  To set up a connection
     */
    call() {
        this.initDataChannel(this.peerConnection.createDataChannel("chat"));
    }
    /**
     * To get the local description of the local end of the connection.
     * @returns {null|RTCSessionDescription} the session description for the local end of the connection
     */
    getLocalDescription(): (null | RTCSessionDescription) {
        return this.peerConnection.localDescription;
    }
    /**
     * To get the RTCPeerConnection signaling state.
     * @returns {string} The RTCPeerConnection signaling state
     */
    getSignalingState(): string {
        return this.peerConnection.signalingState;
    }
    /**
    *  To hangup the connection
    */
    hangUp() {
        if (this.peerConnection && (this.peerConnection.signalingState !== "closed")) {
            this.peerConnection.getSenders().forEach(sender => {
                this.peerConnection.removeTrack(sender);
            });
            this.peerConnection.close();
        }
    }
    /**
     * To initialize the RTCPeerConnection object
     */
    init() {
        this.initPeerConnection();
    }
    /**
         * To configure handler for various WebRTC events
         * @date 8/18/2023 - 9:56:30 AM
         *
         * @param {string} eventType Event Type
         * @param {function} handler Event handler
         */
    on(eventType: string, handler: any) {
        switch (eventType) {
            case "dataChannelClose":
                this.dataChannelCloseHandler = handler;
                break;
            case "dataChannelError":
                this.dataChannelErrorHandler = handler;
                break;
            case "dataChannelMessage":
                this.dataChannelMessageHandler = handler;
                break;
            case "dataChannelOpen":
                this.dataChannelOpenHandler = handler;
                break;
            case "iceCandidate":
                this.iceCandidateEventHandler = handler;
                break;
            case "iceConnectionStateChange":
                this.iceConnectionStateChangeHandler = handler;
                break;
            case "iceGatheringStateChange":
                this.iceGatheringStateChangeHandler = handler;
                break;
            case "negotiation":
                this.negotiationHandler = handler;
                break;
            case "peerConnectionStateChange":
                this.peerConnectionStateChangeHandler = handler;
                break
            case "signalingStateChange":
                this.signalingStateChangeHandler = handler;
                break;
            case "stream":
                this.trackEventHandler = handler;
                break;
            default: break;
        }
    }
    /**
     * Trigger the peer connection to restart ICE
     */
    restartICE() {
        if (this.peerConnection) {
            this.msgLogger("WebRTC:restart ice.");
            this.peerConnection.restartIce();
        }
    }
    /**
     * Sending data to the remote peer via the WebRTC connection.
     * @date 8/18/2023 - 9:59:40 AM
     *
     * @param {any} data The data that to be sent remote peer.
     */
    send(data: any) {
        if (this.dataChannel) {
            switch (this.dataChannel.readyState) {
                case "open":
                    this.dataChannel.send(data);
                    break;
                case "closed":
                case "closing":
                    if (this.peerConnection.iceConnectionState === "connected") {
                        this.initDataChannel(this.peerConnection.createDataChannel("chat"));
                        this.dataChannel.send(data);
                    }
                    break;
                default:
                    break;
            }
        } else {
            throw new Error("The Data Channel is not available.");
        }
    }
    /**
     * The Peer Configuration setter
     * @date 8/18/2023 - 10:00:52 AM
     *
     * @param {object} config
     */
    setConfig(config: {}) {
        this.configuration = { ...config };
    }
    /**
     * To control if message error is shown.
     * @param {boolean} debug If true show the error message in console, else do not.
     */
    setDebug(debug: boolean) {
        this.isDebug = debug;
    }
    /**
     *  To set the local description to the local peer connection object
     * @async
     */
    async setLocalDescription() {
        await this.peerConnection.setLocalDescription();
    }
    /**
     * To set the remote description to the local peer connection object
     * @param {RTCSessionDescription} remoteDescription 
     * @async
     */
    async setRemoteDescription(remoteDescription: RTCSessionDescription) {
        await this.peerConnection.setRemoteDescription(remoteDescription);
    }
    /**
     * The local stream setter
     * @param {MediaStream} stream 
     */
    setStream(stream: MediaStream) {
        if (this.peerConnection) {
            if (this.peerConnection) {
                let senders = this.peerConnection.getSenders();
                senders.forEach(sender => {
                    this.peerConnection.removeTrack(sender);
                })
                if (stream) {
                    for (const track of stream.getTracks()) {
                        this.peerConnection.addTrack(track, stream);
                    }
                }
            } else {
                this.localStream = stream;
            }
        } else {
            this.localStream = stream;
        }
    }
    /*========================================================================================*/
    /*      Private Method                                                                    */
    /*========================================================================================*/

    /**
    * Message Logger
    * @param {string} msg 
    */
    private msgLogger = (msg: any) => {
        if (this.isDebug) {
            console.log(msg);
        }
    }
    /**
     * Initialize the data channel and its event handler
     * @date 8/18/2023 - 9:44:27 AM
     *
     * @param {RTCDataChannel} channel
     */
    private initDataChannel = (channel: RTCDataChannel) => {
        this.dataChannel = channel;
        this.dataChannel.onclose = () => {
            this.dataChannelCloseHandler();
        };
        this.dataChannel.onerror = (event) => {
            this.dataChannelErrorHandler(event);
        };
        this.dataChannel.onmessage = (message: any) => {
            this.dataChannelMessageHandler(message);
        };
        this.dataChannel.onopen = () => {
            this.dataChannelOpenHandler();
        };
    }
    /**
     * Initialize the peer connection object and its event handler
     */
    private initPeerConnection = () => {
        this.peerConnection = new RTCPeerConnection(this.configuration);
        this.peerConnection.ondatachannel = (event) => {
            this.initDataChannel(event.channel);
        }
        this.peerConnection.onicecandidate = (event) => {
            this.iceCandidateEventHandler(event.candidate);
        };
        this.peerConnection.onconnectionstatechange = () => {
            this.peerConnectionStateChangeHandler(this.peerConnection.connectionState);
        }
        this.peerConnection.oniceconnectionstatechange = () => {
            this.iceConnectionStateChangeHandler(this.peerConnection.iceConnectionState);
        };
        this.peerConnection.onicegatheringstatechange = () => {
            this.iceGatheringStateChangeHandler(this.peerConnection.iceGatheringState);
        };
        this.peerConnection.onnegotiationneeded = async () => {
            await this.negotiationHandler();
        };
        this.peerConnection.onsignalingstatechange = () => {
            this.signalingStateChangeHandler(this.peerConnection.signalingState);
        };
        this.peerConnection.ontrack = event => {
            this.trackEventHandler(event.streams[0]);
        }
        if (this.localStream) {
            for (const track of this.localStream.getTracks()) {
                this.peerConnection.addTrack(track, this.localStream);
            }
        }
    }
}
