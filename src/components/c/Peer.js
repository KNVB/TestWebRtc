import WebRTC from './WebRTC';
export default class Peer {
    constructor(peerId, peerName) {
        let ignoreOffer = false, isDebug = false;
        let makingOffer = false, polite = false;
        let signalEventHandler;
        let webRTC = new WebRTC();
        /*
        webRTC.on("dataChannelClose",()=>{
            msgLogger("========================Data channel close start==========================");
            msgLogger("Peer "+peerName+" data channel is closed.");
            msgLogger("========================Data channel close end==========================");
        });
        webRTC.on("dataChannelError",(event)=>{
            msgLogger("========================Data channel error start==========================");
            msgLogger("An error occured in Peer "+peerName+" data channel:");
            msgLogger(event);
            msgLogger("========================Data channel error end==========================");
        });
        webRTC.on("dataChannelMessage",
        webRTC.on("dataChannelOpen",						 
        webRTC.on("iceCandidate",
        webRTC.on("iceConnectionStateChange",
        webRTC.on("iceGatheringStateChange",
        webRTC.on("negotiation",
        webRTC.on("signalingStateChange",
        webRTC.on("stream",
        */
        webRTC.setDebug(true);

        webRTC.init();
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
        /*        Message Logger                                               */
        /*=====================================================================*/
        let msgLogger = (msg) => {
            if (isDebug) {
                console.log(msg);
            }
        }
    }
}