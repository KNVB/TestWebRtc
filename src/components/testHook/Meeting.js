import io from 'socket.io-client';
export default class Meeting {
    constructor() {
        let addPeerHandler;
        let connectionTimeoutHandler;
        let globalMessageHandler;
        let initPeerListHandler;
        let peerListUpdatedHandler;
        let socket = null;
        
        console.log("Meeting Object constructor is called.");
        this.globalMessageList = [];
        this.shareMedia = { audio: false, video: false }
        /*=====================================================================*/
        /*        To join this meeting                                         */
        /*=====================================================================*/
        this.join = (path, localPeer, localStream) => {
            socket = io(path, {
                transports: ["websocket"],
            });
            socket.on("askConnect", newPeer => {
                console.log("====================================");
                console.log("Receive Hi Event from " + JSON.stringify(newPeer) + ".");
                addPeerHandler(newPeer)
                console.log("====================================");
            });
            socket.emit("hi", localPeer.getPeerName(), response => {
                console.log("====Sent Hi Response Start====");
                console.log("response:" + JSON.stringify(response));
                initPeerListHandler(response);
                console.log("====Sent Hi Response End====");
            });
        }
        /*====================================================================*/
        /*        To leave the meeting                                         */
        /*=====================================================================*/
        this.leave = () => {
            if (socket) {
                socket.disconnect();
            }
        }
        /*=====================================================================*/
        /*        To configure handler for varies event                        */
        /*=====================================================================*/
        this.on = (eventType, param) => {
            switch (eventType) {
                case "addPeer":
                    addPeerHandler = param;
                    break;
                case "connectionTimeout":
                    connectionTimeoutHandler = param;
                    break;
                case "globalMessage":
                    globalMessageHandler = param;
                    break;
                case "initPeerList":
                    initPeerListHandler = param;
                    break;
                case "peerListUpdated":
                    peerListUpdatedHandler = param;
                    break;
                default: break;
            }
        }
    }
}