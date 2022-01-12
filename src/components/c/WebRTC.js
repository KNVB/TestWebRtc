export default class WebRTC {
    constructor() {
        let configuration = {};
        let dataChannel = null;
        let dataChannelCloseHandler, dataChannelErrorHandler;
        let dataChannelMessageHandler, dataChannelOpenHandler;
        let iceCandidateEventHandler, iceConnectionStateChangeHandler, iceGatheringStateChangeHandler;
        let isDebug = false, localStream = null;
        let negotiationHandler, peerConnection = null, peerConnectionStateChangeHandler;
        let signalingStateChangeHandler, trackEventHandler;
        /*=====================================================================*/
        /*        Add ICE Candidate to Peer Connection                         */
        /*=====================================================================*/
        this.addICECandidate = (iceCandidate) => {
            peerConnection.addIceCandidate(iceCandidate);
        }
        /*=====================================================================*/
        /*        To set up a connection                                       */
        /*=====================================================================*/
        this.call = () => {
            initDataChannel(peerConnection.createDataChannel("chat"));
        }
        /*=====================================================================*/
        /*        To hangup the connection                                     */
        /*=====================================================================*/
        this.hangUp = () => {
            hangUp();
        }
        /*=====================================================================*/
        /*        To get the local description                                 */
        /*=====================================================================*/
        this.getLocalDescription = () => {
            return peerConnection.localDescription;
        }
        /*=====================================================================*/
        /*        To get the RTCPeerConnection signal state                    */
        /*=====================================================================*/
        this.getSignalingState = () => {
            return peerConnection.signalingState;
        }
        /*=====================================================================*/
        /*        To initialize the RTCPeerConnection object                   */
        /*=====================================================================*/
        this.init = () => {
            initPeerConnection();
        }
        /*=====================================================================*/
        /*        To configure handler for varies event                        */
        /*=====================================================================*/
        this.on = (eventType, param) => {
            switch (eventType) {
                case "dataChannelClose":
                    dataChannelCloseHandler = param;
                    break;
                case "dataChannelError":
                    dataChannelErrorHandler = param;
                    break;
                case "dataChannelMessage":
                    dataChannelMessageHandler = param;
                    break;
                case "dataChannelOpen":
                    dataChannelOpenHandler = param;
                    break;
                case "iceCandidate":
                    iceCandidateEventHandler = param;
                    break;
                case "iceConnectionStateChange":
                    iceConnectionStateChangeHandler = param;
                    break;
                case "iceGatheringStateChange":
                    iceGatheringStateChangeHandler = param;
                    break;
                case "negotiation":
                    negotiationHandler = param;
                    break;
                case "peerConnectionStateChange":
                    peerConnectionStateChangeHandler = param;
                    break
                case "signalingStateChange":
                    signalingStateChangeHandler = param;
                    break;
                case "stream":
                    trackEventHandler = param;
                    break;
                default: break;
            }
        }
        /*=====================================================================*/
        /*        Restart ICE                                                  */
        /*=====================================================================*/
        this.restartICE = () => {
            if (peerConnection) {
                msgLogger("WebRTC:restart ice.")
                peerConnection.restartIce();
            }
        }
        /*=====================================================================*/
        /*       Send data across the data channel to the remote peer.         */
        /*=====================================================================*/
        this.send = (data) => {
            if (dataChannel) {
                switch (dataChannel.readyState) {
                    case "open":
                        dataChannel.send(data);
                        break;
                    case "closed":
                    case "closing":
                        if (peerConnection.iceConnectionState === "connected") {
                            initDataChannel(peerConnection.createDataChannel("chat"));
                            dataChannel.send(data);
                        }
                        break;
                    default:
                        break;
                }
            } else {
                throw new Error("The Data Channel is not available.");
            }
        }
        /*=====================================================================*/
        /*        Set the Configuration                                        */
        /*=====================================================================*/
        this.setConfig = (config) => {
            configuration = { ...config };
        }
        /*=====================================================================*/
        /*        To control if message error is shown                         */
        /*=====================================================================*/
        this.setDebug = (debug) => {
            isDebug = debug;
        }
        /*=====================================================================*/
        /*        To set the local description                                 */
        /*=====================================================================*/
        this.setLocalDescription = async () => {
            await peerConnection.setLocalDescription();
        }
        /*=====================================================================*/
        /*        To set the remote description                                 */
        /*=====================================================================*/
        this.setRemoteDescription = async (remoteDescription) => {
            await peerConnection.setRemoteDescription(remoteDescription);
        }
        /*=====================================================================*/
        /*       The local stream setter                                       */
        /*=====================================================================*/
        this.setStream = (stream) => {
            if (peerConnection) {
                setStream(stream);
            } else {
                localStream = stream;
            }
        }
        /*========================================================================================*/
        /*      Private Method                                                                    */
        /*========================================================================================*/
        /*=====================================================================*/
        /*        Hang Up                                                      */
        /*=====================================================================*/
        let hangUp = () => {
            if (peerConnection) {
                peerConnection.getSenders().forEach(sender => {
                    peerConnection.removeTrack(sender);
                });
                peerConnection.close();
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
        /*        Initialize the data channel                                  */
        /*=====================================================================*/
        let initDataChannel = (channel) => {
            dataChannel = channel;
            dataChannel.onclose = () => {
                dataChannelCloseHandler();
            };
            dataChannel.onerror = (event) => {
                dataChannelErrorHandler(event);
            };
            dataChannel.onmessage = (message) => {
                dataChannelMessageHandler(message);
            };
            dataChannel.onopen = () => {
                dataChannelOpenHandler();
            };
        }
        /*=====================================================================*/
        /*        Initialize the peer connection object                        */
        /*=====================================================================*/
        let initPeerConnection = () => {
            peerConnection = new RTCPeerConnection(configuration);
            peerConnection.ondatachannel = (event) => {
                initDataChannel(event.channel);
            }
            peerConnection.onicecandidate = (event) => {
                iceCandidateEventHandler(event.candidate);
            };
            peerConnection.onconnectionstatechange = () => {
                peerConnectionStateChangeHandler(peerConnection.connectionState);
            }
            peerConnection.oniceconnectionstatechange = () => {
                iceConnectionStateChangeHandler(peerConnection.iceConnectionState);
            };
            peerConnection.onicegatheringstatechange = () => {
                iceGatheringStateChangeHandler(peerConnection.iceGatheringState);
            };
            peerConnection.onnegotiationneeded = async () => {
                await negotiationHandler();
            };
            peerConnection.onsignalingstatechange = () => {
                signalingStateChangeHandler(peerConnection.signalingState);
            };
            peerConnection.ontrack = event => {
                trackEventHandler(event.streams[0]);
            }
        }
        /*=====================================================================*/
        /*        Set a stream to a RTCPeerConnection                          */
        /*=====================================================================*/
        let setStream = (stream) => {
            if (peerConnection) {
                let senders = peerConnection.getSenders();
                senders.forEach(sender => {
                    peerConnection.removeTrack(sender);
                })
                if (stream) {
                    for (const track of stream.getTracks()) {
                        peerConnection.addTrack(track, stream);
                    }
                }
            } else {
                localStream = stream;
            }
        }
    }
}