import WebRTC from "./WebRTC";
export default class Peer{
    constructor(peerName,peerId){
        let webRTC=new WebRTC(peerName);
        let closeEventHandler = [], connectedEventHandler = [];
        let dataEventHandler = [], signalEventHandler = [], streamEventHandler = [];
        let isDebug = false;
        this.isCall = false;
        this.peerId=peerId;
        let webRtcConfig = {};

        webRTC.setDebug(true);
        this.name = peerName;
        /*=====================================================================*/
        /*        To make a WebRTC connection                                  */
        /*=====================================================================*/
        this.call = () => {
            msgLogger("Make Call to " + peerName);
            webRTC.call();
        }
        /*=====================================================================*/
        /*        To hangup the WebRTC connection                              */
        /*=====================================================================*/
        this.hangUp = () => {
            webRTC.hangUp();
        }
        /*=====================================================================*/
        /*        To initialize the WebRTC object                              */
        /*=====================================================================*/
        this.init = () => {
            webRTC.on("close", () => {
                msgLogger("Connection to " + peerName + " is closed.");
                closeEventHandler.forEach(handler => {
                    handler();
                })
            });
            webRTC.on("connect", () => {
                msgLogger("Connection to " + peerName + " is established.");
                connectedEventHandler.forEach(handler => {
                    handler();
                })
            })
            webRTC.on('signal', data => {
                msgLogger("Emit signal event to " + peerName + ".");
                signalEventHandler.forEach(handler => {
                    handler({ to: this.peerId, signalContent: data });
                });
            });
            webRTC.on("data", (data) => {
                msgLogger("Receive stream event from " + peerName + ".");
                dataEventHandler.forEach(handler => {
                    handler(data);
                });
            });
            webRTC.on("stream", (stream) => {
                msgLogger("Receive stream event from " + peerName + ".");
                doStreamEvent(stream);
            });
            webRTC.setConfig(webRtcConfig);            
            webRTC.init();
        }
        /*=====================================================================*/
        /*        To configure handler for varies event                        */
        /*=====================================================================*/
        this.on = (eventType, handler) => {
            switch (eventType) {
                case "connect":
                    connectedEventHandler.push(handler);
                    break
                case "data":
                    dataEventHandler.push(handler);
                    break;
                case "signal":
                    signalEventHandler.push(handler);
                    break;
                case "stream":
                    streamEventHandler.push(handler);
                    break;
                default:
                    break;
            }
        }
        /*=====================================================================*/
        /*        To control if message error is shown                         */
        /*=====================================================================*/
        this.setDebug = (debug) => {
            isDebug = debug;
        }
        /*=====================================================================*/
        /*       Set the media stream to the WebRTC Object                     */
        /*=====================================================================*/
        this.setStream = (stream) => {
            webRTC.setStream(stream);
        }
        /*=====================================================================*/
        /*       Set the signal data to the WebRTC Object                      */
        /*=====================================================================*/
        this.signal = (signalData) => {
            webRTC.signal(signalData);
        }
        /*=====================================================================*/
        /*       Strigger the stream event                                     */
        /*=====================================================================*/
        this.stream = (stream) => {
            doStreamEvent(stream);
        }
        /*=====================================================================*/
        /*        Set the Web RTC configuration                                */
        /*=====================================================================*/
        this.setWebRTCConfig=(config)=>{
            webRtcConfig=config;
        }
        /*=====================================================================*/
        /*      Private function                                               */
        /*=====================================================================*/
        /*=====================================================================*/
        /*      Do Stream Event                                                */
        /*=====================================================================*/
        let doStreamEvent = (stream) => {
            streamEventHandler.forEach(handler => {
                handler(stream);
            });
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