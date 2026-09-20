import io from 'socket.io-client';
class Meeting {
    #connectionTimeoutHandler;
    #globalMessageHandler;
    #initPeerListHandler;
    #newPeerEventHandler;
    #reconnectEventHandler;
    #removePeerIdListEventHandler;
    #signalEventHandler;
    #updatePeerNameEventHandler;

    #isDebug = false;
    #socket = null;
    /**
     * Creates an instance of Meeting.
     * @date 8/18/2023 - 11:09:44 AM
     * @class Meeting
     * @constructor
     */
    constructor() {
        console.log("Meeting Object constructor is called.");
    }
    /**
     * Join the meeting
     * @date 8/18/2023 - 11:16:12 AM
     *
     * @param {string} path Winsocket Path
     * @param {Peer} localPeer PeerObject
     */
    join(path, localPeer) {
        this.#socket = io(path, {
            transports: ["websocket"],
        });
        this.#socket.io.on("reconnect", () => {
            console.log("Reconnect successed.");
            this.#socket.emit("reJoinRequest", localPeer, response => {
                switch (response.status) {
                    case 1:
                        this.#connectionTimeoutHandler("Connection time out, please connect the meeting again.");
                        break;
                    default:
                        break;
                }
            });
        });
        this.#socket.emit("hi", localPeer.peerName, response => {
            this.#msgLogger("====Receive Say Hi response start=========")
            this.#initPeerListHandler(response);
            this.#msgLogger("======Receive Say Hi response end=========")
        });
        this.#socket.on("askConnect", newPeer => {
            this.#msgLogger("====Receive Say Hi from " + newPeer.peerName + " start=========")
            this.#newPeerEventHandler(newPeer);
            this.#msgLogger("====Receive Say Hi from " + newPeer.peerName + " end===========")
        });
        this.#socket.on("askReconnect", peer => {
            this.#msgLogger("====Receive reconnect event from " + peer.peerName + " start========");
            this.#reconnectEventHandler(peer);
            this.#msgLogger("====Receive reconnect event from " + peer.peerName + " end==========");
        });
        this.#socket.on("globalMessage", msgObj => {
            this.#msgLogger("====Receive Global Message start=========");
            this.#globalMessageHandler(msgObj);
            this.#msgLogger("====Receive Global Message start=========");
        })
        this.#socket.on("removePeerIdList", list => {
            this.#msgLogger("====Receive Remove Peer List Start====");
            this.#msgLogger("list=" + list);
            this.#removePeerIdListEventHandler(list);
            this.#msgLogger("====Receive Remove Peer List End====");
        });
        this.#socket.on("signalData", signalObj => {
            this.#msgLogger("====Receive Signal Event Start====");
            this.#signalEventHandler(signalObj);
            this.#msgLogger("====Receive Signal Event End====");
        });
        this.#socket.on("updatePeerName", peer => {
            this.#msgLogger("====Receive Peer Name Event Start====");
            this.#updatePeerNameEventHandler(peer);
            this.#msgLogger("====Receive Peer Name Event End====");
        });
    }
    /**
     * Leave the meeting
     */
    leave = () => {
        if (this.#socket) {
            this.#socket.disconnect();
            this.#socket = null;
        }
    }
    /**
     * To configure handler for various meeting events
     * @date 8/18/2023 - 9:56:30 AM
     *
     * @param {string} eventType Event Type
     * @param {function} handler Event handler
     */
    on(eventType, handler) {
        switch (eventType) {
            case "connectionTimeout":
                this.#connectionTimeoutHandler = handler;
                break;
            case "globalMessage":
                this.#globalMessageHandler = handler;
                break
            case "initPeerList":
                this.#initPeerListHandler = handler;
                break;
            case "newPeerEvent":
                this.#newPeerEventHandler = handler;
                break;
            case "reconnectEvent":
                this.#reconnectEventHandler = handler;
                break;
            case "removePeerIdList":
                this.#removePeerIdListEventHandler = handler;
                break;
            case "signalEvent":
                this.#signalEventHandler = handler;
                break;
            case "updatePeerNameEvent":
                this.#updatePeerNameEventHandler = handler;
                break;
            default: break;
        }
    }

    /**
     * Send a message to all member of the meeting
     * @date 8/18/2023 - 11:22:48 AM
     *
     * @param {string} msgObj
     */
    sendGlobalMessage = msgObj => {
        this.#socket.emit("sendGlobalMessage", msgObj);
    }
    /**
    * To control if message error is shown.
    * @param {boolean} debug If true show the error message in console, else do not.
    */
    setDebug(debug) {
        this.#isDebug = debug;
    }
    /**
     * To send a signal data to remote peer
     * @date 8/18/2023 - 11:24:14 AM
     *
     * @param {Object} signalData That including ICE Candidate and SDP
     */
    sendSignalData(signalData) {
        this.#socket.emit("signal", signalData, response => {
            switch (response.status) {
                case 1:
                    this.#connectionTimeoutHandler("Connection time out, please connect the meeting again.");
                    break;
                case 2:
                    console.log("The destination peer does not exist.");
                    break;
                default:
                    break;
            }
        });
    }
    /**
     * To send the updated peer name to other members of the meeting
     * @date 8/18/2023 - 11:25:38 AM
     *
     * @param {string} peerId The peer Id
     * @param {string} newName The new Peer Name.
     */
    updateLocalPeerName(peerId, newName) {
        this.#socket.emit("updatePeerName", { "peerId": peerId, "peerName": newName });
    }
    /*========================================================================================*/
    /*      Private Method                                                                    */
    /*========================================================================================*/
    /**
     * Message Logger
     * @param {string} msg 
     */
    #msgLogger = (msg) => {
        if (this.#isDebug) {
            console.log(msg);
        }
    }
}
export default Meeting