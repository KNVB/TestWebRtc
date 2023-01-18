import io from 'socket.io-client';
import { useReducer, useRef } from "react";
import LocalStreamManager from '../../util/LocalStreamManager';
import Peer from "./Peer";
import WebRTC_Config from "./WebRTC-Config";
let reducer = (state, action) => {
    let result = { ...state };
    let temp;
    //console.log(action);
    switch (action.type) {
        case "initPeerList":
            result.isJoined = true;
            result.localPeer.peerId = action.localPeerId;
            result.peerList = { ...action.peerList };
            break;
        case "initSocket":
            result.socket = action.socket;
            break
        case "leave":
            result = {
                globalMessage: "",
                globalMessageList: [],
                isDebug: state.isDebug,
                isJoined: false,
                isShareAudio: false,
                isShareVideo: false,
                localPeer: { peerName: '' },
                localStream: null,
                "localStreamManager": new LocalStreamManager(),
                peerList: [],
                socket: null
            }
            break;
        case "newPeer":
            action.newPeer.setStream(result.localStream);
            action.newPeer.call();
            result.peerList[action.newPeer.peerId] = action.newPeer;
            break;
        case "reconnect":
            result.peerList[action.peerId].restartICE();
            break;
        case "removePeerId":
            action.removePeerIdList.forEach(peerId => {
                if (result.peerList[peerId]) {
                    result.peerList[peerId].hangUp();
                    delete result.peerList[peerId];
                }
            })
            break;
        case "setGlobalMessage":
            result.globalMessage = action.message;
            break;
        case "setLocalPeerName":
            result.localPeer.peerName = action.newName;
            break
        case "setShareMedia":
            result.isShareAudio = action.isShareAudio;
            result.isShareVideo = action.isShareVideo;
            result.localStream = action.localStream;
            break;
        case "signalEvent":
            result.peerList[action.signalObj.from].signal(action.signalObj);
            break;
        case "updateGlobalMessageList":
            let fromPeer;
            if (result.localPeer.peerId === action.msgObj.from) {
                fromPeer = result.localPeer;
            } else {
                fromPeer = result.peerList[action.msgObj.from];
            }
            temp = [{ from: fromPeer.peerName, message: action.msgObj.message }];
            temp = temp.concat(result.globalMessageList);
            result.globalMessageList = temp;
            result.globalMessage = '';
            break;
        case "updatePeerName":
            temp = result.peerList[action.peer.peerId]
            if (temp) {
                console.log("Peer :" + temp.peerName + " change the name to " + action.peer.peerName);
                temp.peerName = action.peer.peerName;
                result.peerList[action.peer.peerId] = temp;
            }
            break;
        default:
            break;
    }
    return result;
}

export function useMeeting(isDebug) {
    let [itemList, updateItemList] = useReducer(reducer, {
        globalMessage: "",
        globalMessageList: [],
        isDebug: isDebug,
        isJoined: false,
        isShareAudio: false,
        isShareVideo: false,
        localPeer: { peerName: '' },
        localStream: null,
        "localStreamManager": new LocalStreamManager(),
        peerList: [],
        socket: null
    })
    const itemListRef = useRef(itemList);
    itemListRef.current = itemList;
    let addNewPeer = newPeer => {
        let peer = genPeer(newPeer);
        updateItemList({ "newPeer": peer, type: "newPeer" });
    }
    let connectionTimeoutHandler = msg => {
        alert(msg);
        leave();
    }
    let initPeerList = obj => {
        //console.log(obj);
        let peerList = {}
        for (const [newPeerId, tempPeer] of Object.entries(obj.peerList)) {
            let peer = genPeer(tempPeer);
            peerList[newPeerId] = peer;
        }
        updateItemList({ localPeerId: obj.peerId, "peerList": peerList, type: "initPeerList" });
    }
    let join = (path) => {
        if (itemList.localPeer.peerName === '') {
            alert("Please enter your alias before joining a meeting.");
        } else {
            let socket = io(path, {
                transports: ["websocket"],
            });
            socket.io.on("reconnect", () => {
                console.log("Reconnect successed.");
                socket.emit("reJoinRequest", itemList.localPeer, response => {
                    switch (response.status) {
                        case 1:
                            connectionTimeoutHandler("Connection time out, please connect the meeting again.");
                            break;
                        default:
                            break;
                    }
                });
            });
            socket.emit("hi", itemList.localPeer.peerName, response => {
                msgLogger("====Receive Say Hi response start=========")
                initPeerList(response);
                msgLogger("======Receive Say Hi response end=========")
            });
            socket.on("askConnect", newPeer => {
                msgLogger("====Receive Say Hi from " + newPeer.peerName + " start=========")
                addNewPeer(newPeer);
                msgLogger("====Receive Say Hi from " + newPeer.peerName + " end===========")
            });
            socket.on("askReconnect", peer => {
                msgLogger("====Receive reconnect event from " + peer.peerName + " start========");
                reconnectEventHandler(peer);
                msgLogger("====Receive reconnect event from " + peer.peerName + " end==========");
            });
            socket.on("globalMessage", msgObj => {
                msgLogger("====Receive Global Message start=========");
                globalMessageHandler(msgObj);
                msgLogger("====Receive Global Message start=========");
            });
            socket.on("removePeerIdList", list => {
                msgLogger("====Receive Remove Peer List Start====");
                msgLogger("list=" + list);
                removePeerIdListEventHandler(list);
                msgLogger("====Receive Remove Peer List End====");
            });
            socket.on("signalData", signalObj => {
                msgLogger("====Receive Signal Event Start====");
                signalEventHandler(signalObj);
                msgLogger("====Receive Signal Event End====");
            });
            socket.on("updatePeerName", peer => {
                msgLogger("====Receive Peer Name Event Start====");
                updatePeerNameEventHandler(peer);
                msgLogger("====Receive Peer Name Event End====");
            });
            updateItemList({ "socket": socket, type: "initSocket" });
        }
    }
    let leave = async () => {
        await itemList.localStreamManager.closeStream(itemList.localStream);
        if (itemList.socket) {
            Object.values(itemList.peerList).forEach(peer => {
                peer.hangUp();
            });
            itemList.socket.disconnect();
        }
        updateItemList({ type: "leave" });
    }
    let genPeer = (newPeer) => {
        let peer = new Peer();
        peer.peerName = newPeer.peerName;
        peer.peerId = newPeer.peerId;
        peer.setConfig(WebRTC_Config);
        peer.setDebug(false);
        peer.init();
        peer.on("signal", signalData => {
            let temp = { from: itemList.localPeer.peerId, to: newPeer.peerId, signalData };
            let sendSignalDataResult = sendSignalData(temp);
            switch (sendSignalDataResult) {
                case 1:
                    connectionTimeoutHandler("Connection time out, please connect the meeting again.");
                    break;
                case 2:
                    console.log("The destination peer does not exist.");
                    break;
                default:
                    break;
            }
        });
        peer.on("dataChannelMessage", msgObj => {
            //updateItemList({type:"updateGlobalMessageList",msgObj:JSON.parse(msgObj)});           
        });
        return peer;
    }
    let globalMessageHandler = msgObj => {
        updateItemList({ "msgObj": msgObj, type: "updateGlobalMessageList" });
    }   
    /*=====================================================================*/
    /*        Message Logger                                               */
    /*=====================================================================*/
    let msgLogger = (msg) => {
        if (itemList.isDebug) {
            console.log(msg);
        }
    }
    let reconnectEventHandler = peer => {
        updateItemList({ "type": "reconnect", "peerId": peer.peerId });
    }
    let removePeerIdListEventHandler = list => {
        updateItemList({ removePeerIdList: list, type: "removePeerId" });
    }
    let sendGlobalMessage = () => {
        if (itemList.globalMessage === '') {
            throw new Error("Please enter your global message first.");
        } else {
            let msgObj = { from: itemList.localPeer.peerId, message: itemList.globalMessage };
            itemList.socket.emit("sendGlobalMessage", msgObj);
            updateItemList({ msgObj: msgObj, type: "updateGlobalMessageList" });
        }
    }
    /*========================================================================================*/
    /*  To send a signal data to remote peer                                                  */
    /*========================================================================================*/
    let sendSignalData = signalData => {
        itemListRef.current.socket.emit("signal", signalData, response => {
            switch (response.status) {
                case 1:
                    connectionTimeoutHandler("Connection time out, please connect the meeting again.");
                    break;
                case 2:
                    console.log("The destination peer does not exist.");
                    break;
                default:
                    break;
            }
        });
    }
    let signalEventHandler = signalObj => {
        msgLogger("====Receive Signal Event Start====");
        updateItemList({ signalObj: signalObj, type: "signalEvent" });
        msgLogger("====Receive Signal Event End====");
    }
    let setGlobalMessage = message => {
        updateItemList({ "message": message, "type": "setGlobalMessage" });
    }
    let setLocalPeerName = newName => {
        updateItemList({ "newName": newName, type: "setLocalPeerName" });
        if (itemList.isJoined) {
            itemList.socket.emit("updatePeerName", { "peerId": itemList.localPeer.peerId, "peerName": newName });
        }
    }
    let setShareMedia = async (isShareVideo, isShareAudio) => {
        let localStream;
        try {
            localStream = await itemList.localStreamManager.getMediaStream(isShareVideo, isShareAudio);
        } catch (error) {
            console.log("Get Media Stream failure:" + error.message);
            localStream = null;
        } finally {
            if (itemList.localStream) {
                await itemList.localStreamManager.closeStream(itemList.localStream);
            }
            
            if (localStream) {
                Object.values(itemList.peerList).forEach(peer => {
                    peer.setStream(localStream);
                });
            }/*else {
                Object.values(itemList.peerList).forEach(peer => {
                    peer.removeAllTracks();
                });    
            }*/
            updateItemList({
                isShareAudio: isShareAudio,
                isShareVideo: isShareVideo,
                localStream: localStream,
                type: "setShareMedia"
            });
        }
    }
    let setShareAudio = value => {
        let isShareAudio = (value === "true");
        setShareMedia(itemList.isShareVideo, isShareAudio);
    }
    let setShareVideo = value => {
        let isShareVideo = (value === "true");
        setShareMedia(isShareVideo, itemList.isShareAudio);
    }
    let updatePeerNameEventHandler = peer => {
        updateItemList({ type: "updatePeerName", "peer": peer });
    }
    return [
        itemList.globalMessage,
        itemList.globalMessageList,
        itemList.isJoined,
        itemList.isShareAudio,
        itemList.isShareVideo,
        itemList.localPeer,
        itemList.localStream,
        itemList.peerList,
        {
            leave,
            join,
            sendGlobalMessage,
            setGlobalMessage,
            setLocalPeerName,
            setShareAudio,
            setShareVideo
        }
    ]
}