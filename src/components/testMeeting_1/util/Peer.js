import WebRTC from "./WebRTC";
export default class Peer {
    constructor(peerName, remoteSocketId) {
        let configuration = {
            iceServers: [
                { urls: "stun:stun.stunprotocol.org" },
                { urls: "stun:stun.l.google.com:19302" },
                {
                    urls: "turn:numb.viagenie.ca",
                    credential: "turnserver",
                    username: "sj0016092@gmail.com",
                },
            ],
        }
        let closeEventHandler = [], connectedEventHandler = [];
        let dataEventHandler = [], signalEventHandler = [], streamEventHandler = [];
        let isDebug = false;
        let webRTC = new WebRTC(peerName);
        this.socketId = remoteSocketId;
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
            webRTC.setConfiguration(configuration);
            webRTC.init();
        }
        /*=====================================================================*/
        /*        To configure handler for varies event                        */
        /*=====================================================================*/
        this.on = (eventType, handler) => {
            switch (eventType) {
                case "close":
                    closeEventHandler.push(handler);
                    break;
                case "connect":
                    connectedEventHandler.push(handler);
                    break;
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
            webRTC.setDebug(debug);
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
