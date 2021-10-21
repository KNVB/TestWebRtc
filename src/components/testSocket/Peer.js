import WebRTC from "./WebRTC";
export default class Peer {
    constructor(peerName, remoteSocketId) {
        let closeEventHandler = [], connectedEventHandler = [];
        let dataEventHandler = [], signalEventHandler = [], streamEventHandler = [];
        let isDebug=false;
        this.socketId = remoteSocketId;
        let webRTC = new WebRTC(peerName);
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
                    handler({ to: this.socketId, signalData: data });
                });
            });
            webRTC.on("data", (data) => {
                msgLogger("Receive stream event from " + peerName + ".");
                dataEventHandler.forEach(handler => {
                    handler({ "data": data, peer: this });
                });
            });
            webRTC.on("stream", (stream) => {
                msgLogger("Receive stream event from " + peerName + ".");
                streamEventHandler.forEach(handler => {
                    handler({ peer: this, "stream": stream });
                })
            });
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
        this.setDebug=(debug)=>{
            isDebug=debug;
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
//========================================================================================
//      Private function        
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
