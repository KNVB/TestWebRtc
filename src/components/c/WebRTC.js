export default class WebRTC {
    constructor() {
        let dataHandler;
        let dataChannelCloseHandler, dataChannelOpenHandler;
        let iceCandidateEventHandler, iceConnectionStateChangeHandler, iceGatheringStateChangeHandler;
        let ignoreOffer = false, isDebug = false;
        let localStream = null, makingOffer = false;
        let peerConnection = null, polite = false;
        let signalingStateChangeHandler, signalEventHandler, trackHandler;
        /*=====================================================================*/
        /*        To configure handler for varies event                        */
        /*=====================================================================*/
        this.on = (eventType, param) => {
            switch (eventType) {
                case "close":
                    dataChannelCloseHandler = param;
                    break;
                case "connect":
                    dataChannelOpenHandler = param;
                    break;
                case "data":
                    dataHandler = param;
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
                case "signal":
                    signalEventHandler = param;
                    break;
                case "signalingStateChange":
                    signalingStateChangeHandler = param;
                    break;
                case "stream":
                    trackHandler = param;
                    break;
                default: break;
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
    }
}