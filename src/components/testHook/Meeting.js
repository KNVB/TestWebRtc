import io from 'socket.io-client';

export default class Meeting {
    constructor(){
        let initPeerListHandler;
        let newPeerEventHandler;
        let removePeerIdListEventHandler;

        let isDebug = false;        
        let socket = null;
        let signalEventHandler;
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
            socket.on("removePeerIdList", list => {
                msgLogger("====Receive Remove Peer List Start====");
                msgLogger("list="+list);
                removePeerIdListEventHandler(list);
                msgLogger("====Receive Remove Peer List End====");
            });
            socket.on("signalData", signalObj => {
                msgLogger("====Receive Signal Event Start====");
                signalEventHandler(signalObj);
                msgLogger("====Receive Signal Event End====");
            })    
            socket.emit("hi", localPeer.getPeerName(), response => {
                msgLogger("====Receive Say Hi response start=========")
                initPeerListHandler(response);
                msgLogger("======Receive Say Hi response end=========")                
            });
        }
        this.leave=()=>{
            if (socket) {
                socket.disconnect();
                socket = null;
            }
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
                    break;
                case "removePeerIdList":
                    removePeerIdListEventHandler=param;
                    break;
                case "signalEvent":
                    signalEventHandler=param;
                    break;
                default: break;
            }
        }
        this.sendSignalData=signalData=>{
            let result=0;
            socket.emit("signal", signalData, response => {
                result=response.status;
            });
            return result;
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