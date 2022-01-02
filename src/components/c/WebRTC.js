export default class WebRTC {
    constructor() {
        let configuration = {};
        let dataChannel;
        let dataChannelCloseHandler, dataChannelErrorHandler;
        let dataChannelMessageHandler, dataChannelOpenHandler;
        let iceCandidateEventHandler, iceConnectionStateChangeHandler, iceGatheringStateChangeHandler;
        let isDebug = false, localStream = null;
        let negotiationHandler, peerConnection = null
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
            dataChannel = peerConnection.createDataChannel("chat");
            initDataChannel();
        }
        /*=====================================================================*/
        /*        To hangup the connection                                     */
        /*=====================================================================*/
        this.hangUp = () => {
            hangUp();
        }
        this.getLocalDescription = () => {
            return peerConnection.localDescription;
        }
        this.getSignalingState=()=>{
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
        /*       Send data to remote peer                                      */
        /*=====================================================================*/
        this.send = (data) => {
            if (dataChannel) {
                dataChannel.send(data);
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
        this.setLocalDescription = async () => {
            await peerConnection.setLocalDescription();
        }
        this.setRemoteDescription = async (remoteDescription) => {
            await peerConnection.setRemoteDescription(remoteDescription);
        }
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
        let initDataChannel = () => {
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
        let initPeerConnection = () => {
            peerConnection = new RTCPeerConnection(configuration);
            peerConnection.ondatachannel = (event) => {
                dataChannel = event.channel;
                initDataChannel();
            }
            peerConnection.onicecandidate = (event) => {
                iceCandidateEventHandler(event.candidate);
            };
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
    }
}