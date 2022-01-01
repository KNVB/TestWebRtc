import WebRTC from './WebRTC';
export default class Peer {
    constructor(peerId, peerName) {
        let ignoreOffer = false, isDebug = false;
        let makingOffer = false, polite = false;
        let signalEventHandler;
        let webRTC = new WebRTC();
        
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
        //webRTC.on("dataChannelMessage",
        webRTC.on("dataChannelOpen",()=>{
            msgLogger("========================Data channel open start==========================");
            msgLogger("Peer "+peerName+" data channel is opened.");
            msgLogger("========================Data channel open end==========================");
        });						 
        
        webRTC.on("iceCandidate",candidate=>{
            if (candidate){
                signalEventHandler({type:"iceCandidate",value:candidate});
            } else {
                msgLogger("All ICE candidates are sent to " + peerName);
            }
            
        });
        /*
        webRTC.on("iceConnectionStateChange",
        */
        webRTC.on("iceGatheringStateChange",iceGatheringState=>{
            msgLogger("======================ICE Gathering State Change Start======================");
            msgLogger("Peer:"+peerName+",ICE Gathering State="+iceGatheringState);
            msgLogger("======================ICE Gathering State Change End======================"); 
        });
        
        webRTC.on("negotiation",async()=>{
            msgLogger("========================Negotiation start==========================");
            msgLogger("Peer:"+peerName);
            try {
                makingOffer = true;
                await webRTC.setLocalDescription();
                signalEventHandler({"type":"remoteDescription","value":webRTC.getLocalDescription()});
                msgLogger("Sent local Description to " + peerName);
              } catch (err) {
                msgLogger("Failed to send Local Description:" + err);
              } finally {
                makingOffer = false;
              }
            msgLogger("========================Negotiation end==========================");
        });
        
        webRTC.on("signalingStateChange",signalingState=>{
            msgLogger("======================Signaling State Change Start======================");
            msgLogger("Peer:"+peerName+",signalingState="+signalingState);
            msgLogger("======================Signaling State Change End======================");
        });
        /*
        webRTC.on("stream",
        */
        webRTC.setDebug(true);

        webRTC.init();
        this.addICECandidate=(candidate)=>{
            webRTC.addICECandidate(candidate);
        }
        
        this.call=()=>{
            webRTC.call();
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