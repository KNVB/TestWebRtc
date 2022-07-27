import io from 'socket.io-client';

export default class Meeting {
    constructor(){
        let initPeerListHandler;
        let newPeerEventHandler;
        let isDebug = false;
        let socket = null;
        console.log("Meeting Object constructor is called.");
        this.join=(path,localPeer)=>{
            socket = io(path, {
                transports: ["websocket"],
            });
            socket.on("askConnect", newPeer => {
                msgLogger("====Receive Say Hi from " + newPeer.peerName + " start=========")
                newPeerEventHandler(newPeer);
                msgLogger("====Receive Say Hi from " + newPeer.peerName + " end=========")
            });
            socket.emit("hi", localPeer.getPeerName(), response => {
                msgLogger("====Receive Say Hi response start=========")
                initPeerListHandler(response);
                msgLogger("======Receive Say Hi response end=========")                
            });
        }
        /*=====================================================================*/
        /*        To configure handler for varies event                        */
        /*=====================================================================*/
        this.on = (eventType, param) => {
            switch (eventType) {
                
                case "initPeerList":
                    initPeerListHandler = param;
                    break;
                case "newPeerEvent":    
                    newPeerEventHandler =param;
                default: break;
            }
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