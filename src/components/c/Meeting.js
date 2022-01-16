import io from 'socket.io-client';
import Peer from './Peer';
export default class Meeting {
    constructor(peerName) {
        let globalMessageHandler;
        let peerId = null;
        let peerList = {};
        let peerListUpdatedHandler;
        let socket = null;
        let webRtcConfig = {
            iceServers: [
                { urls: "stun:stun.stunprotocol.org" },
                { urls: "stun:stun.l.google.com:19302" },
                { urls: "stun:stun1.l.google.com:19302"},
                { urls: "stun:stun2.l.google.com:19302"},
                {
                    urls: "turn:numb.viagenie.ca",
                    credential: "turnserver",
                    username: "sj0016092@gmail.com",
                },
            ],            
        };
        console.log("Meeting Object constructor is called.");
        /*=====================================================================*/
        /*        To connect from the meeting                                  */
        /*=====================================================================*/
        this.connect = () => {
            socket = io(process.env.REACT_APP_SOCKET_URL + "c", {
                transports: ["websocket"],
            });
            socket.on("askConnect", newPeer => {
                console.log("Receive Hi Event from " + JSON.stringify(newPeer) + ".");
                let peer = genPeer(newPeer.peerId, newPeer.peerName);
                peer.isCall = true;
                peer.call();
                peerList[peer.peerId] = peer;
                peerListUpdatedHandler(peerList);
            });
            socket.on("askReconnect", reconnectPeerId => {
                let reconnectPeer = peerList[reconnectPeerId];
                console.log("Receive askReconnect Event from " + reconnectPeer.peerName + ".");
                reconnectPeer.restartICE();
            });
            socket.on("removePeerIdList", list => {
                if (list.length > 0) {
                    console.log("Receive remove id List:" + JSON.stringify(list));
                    list.forEach(removePeerId => {
                        if (peerList[removePeerId]){
                            peerList[removePeerId].hangUp();
                            delete peerList[removePeerId];
                        }
                    });
                    peerListUpdatedHandler(peerList);
                }
            });
            socket.io.on("reconnect", () => {
                console.log("Reconnect successed.");
                socket.emit("reconnectRequest", { peerId: peerId, peerName: peerName });
            });
            socket.on("signalData", signalObj => {
                console.log("====Receive Signal Event Start====");
                let peer = peerList[signalObj.from];
                if (peer) {
                    peer.signal(signalObj);
                }
                console.log("====Receive Signal Event End====");
            })
            socket.emit("hi", peerName, response => {
                peerId = response.peerId;
                let tempPeerList = response.peerList;
                console.log("====Sent Hi Response Start====");
                console.log("peerId:" + peerId);
                console.log("====Peer list====");
                for (const [newPeerId, tempPeer] of Object.entries(tempPeerList)) {
                    let peer = genPeer(newPeerId, tempPeer.peerName);
                    peer.isLocalPeer = (response.peerId === peer.peerId);
                    peerList[peer.peerId] = peer;
                }
                console.log(peerList);
                peerListUpdatedHandler(peerList);
                console.log("====Sent Hi Response End====");
            });
        }
        /*=====================================================================*/
        /*        To disconnect from the meeting                               */
        /*=====================================================================*/
        this.disconnect = () => {
            Object.values(peerList).forEach(peer => {
                peer.hangUp();
            });
            peerList = {};
            if (socket) {
                socket.disconnect();
            }
        }
        /*=====================================================================*/
        /*        To configure handler for varies event                        */
        /*=====================================================================*/
        this.on = (eventType, param) => {
            switch (eventType) {
                case "globalMessage":
                    globalMessageHandler=param;
                    break;
                case "peerListUpdated":
                    peerListUpdatedHandler = param;
                    break;
                default: break;
            }
        }
        /*=====================================================================*/
        /*        To send a message to all member in this meeting              */
        /*=====================================================================*/
        this.sendGlobalMessage = message => {
            Object.values(peerList).forEach(peer => {
                if (!peer.isLocalPeer) {
                    peer.sendMessage(message);
                }
            })
        }
        /*========================================================================================*/
        /*      Private Method                                                                    */
        /*========================================================================================*/
        /*  To generate an Peer instance                                                          */  
        /*========================================================================================*/
        let genPeer = (newPeerId, peerName) => {
            let peer = new Peer(newPeerId, peerName), temp;
            peer.on("signal", signalData => {
                temp = { from: peerId, to: peer.peerId, signalData };
                sendSignalData(temp);
            });
            peer.on("dataChannelMessage", message => {
                globalMessageHandler({from:peerName,message:message});
            });
            /*
            peer.on("dataChannelMessage", message => {
                console.log("==== Message received from " + peerName + " start====");
                console.log(message);
                console.log("==== Message received from " + peerName + " end====");
            });
            */
            peer.setConfig(webRtcConfig);
            peer.setDebug(true);
            peer.init();
            return peer;
        }
        /*========================================================================================*/
        /*  To send a signal data to remote peer                                                  */  
        /*========================================================================================*/
        let sendSignalData = (signalData) => {
            socket.emit("signal", signalData);
        }
    }
}