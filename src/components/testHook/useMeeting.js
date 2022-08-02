import { useReducer } from "react";
import LocalStreamManager from '../../util/LocalStreamManager';
import Meeting from "./Meeting";
import Peer from "./Peer";
import WebRTC_Config from "./WebRTC-Config";
let obj = {
    globalMessage: '',
    globalMessageList: [],
    "localPeer": new Peer(),
    "localStream": null,
    "localStreamManager": new LocalStreamManager(),
    "peerList": null,
    "shareAudio": false,
    "shareVideo": false,
}
let closeMedia = async (localStreamManager, localStream) => {
    await localStreamManager.closeStream(localStream);
}

let reducer = (state, action) => {
    let result = { ...state };
    let temp;
    console.log(action);
    switch (action.type) {
        case "initMeeting":
            result.meeting = action.meeting;
            break;
        case "initPeerList":
            result.localPeer.peerId = action.localPeerId;
            result.peerList = { ...action.peerList };
            break;
        case "leaveMeeting":
            Object.values(result.peerList).forEach(peer => {
                peer.hangUp();
            });
            //=====================================================================//
            // It is because the await function cannot be used in the reducer      //
            // function, so an independent function is created for closing the     //
            // local stream.                                                       //
            //=====================================================================//
            closeMedia(result.localStreamManager, result.localStream);
            result.meeting.leave();
            result = {
                globalMessage: '',
                globalMessageList: [],
                "localPeer": new Peer(),
                "localStream": null,
                "localStreamManager": new LocalStreamManager(),
                "peerList": null,
                "shareAudio": false,
                "shareVideo": false,
            };
            break;
        case "newPeer":
            action.newPeer.setStream(result.localStream);
            action.newPeer.isCall = true;
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
            break
        case "updatePeerName":
            temp = result.peerList[action.peer.peerId]
            if (temp) {
                console.log("Peer :" + temp.peerName + " change the name to " + action.peer.peerName);
                temp.peerName = action.peer.peerName;
                result.peerList[action.peer.peerId] = temp;
            }
            break;
        case "updateShareMediaState":
            result.shareAudio = action.isShareAudio;
            result.shareVideo = action.isShareVideo;
            result.localStream = action.localStream;
            break;
        default:
            break;
    }
    return result;
}
export function useMeeting() {
    const [itemList, updateItemList] = useReducer(reducer, obj);

    let leaveMeeting = () => {
        updateItemList({ type: "leaveMeeting" });
    }
    let joinMeeting = (path) => {
        if (itemList.localPeer.peerName === '') {
            alert("Please enter your alias before joining a meeting.");
        } else {
            let meeting = new Meeting(itemList.peerName);
            meeting.setDebug(true);
            meeting.on("connectionTimeout", msg => {
                connectionTimeoutHandler(msg);
            })
            meeting.on("initPeerList", obj => {
                let peerList = {}
                for (const [newPeerId, tempPeer] of Object.entries(obj.peerList)) {
                    let peer = genPeer(tempPeer, meeting);
                    peerList[newPeerId] = peer;
                }
                updateItemList({ type: "initPeerList", localPeerId: obj.peerId, "peerList": peerList });
            });
            meeting.on("globalMessage", msgObj => {
                updateItemList({ type: "updateGlobalMessageList", "msgObj": msgObj });
            });
            meeting.on("newPeerEvent", newPeer => {
                let peer = genPeer(newPeer, meeting);
                updateItemList({ type: "newPeer", "newPeer": peer });
            });
            meeting.on("reconnectEvent", peer => {
                updateItemList({ "type": "reconnect", "peerId": peer.peerId });
            });
            meeting.on("removePeerIdList", list => {
                updateItemList({ type: "removePeerId", removePeerIdList: list });
            });
            meeting.on("signalEvent", signalObj => {
                console.log("====Receive Signal Event Start====");
                updateItemList({ type: "signalEvent", signalObj: signalObj });
                console.log("====Receive Signal Event End====");
            });
            meeting.on("updatePeerNameEvent", peer => {
                updateItemList({ type: "updatePeerName", "peer": peer });
            });
            meeting.join(path, itemList.localPeer);
            updateItemList({ type: "initMeeting", "meeting": meeting });
        }
    }
    let sendGlobalMessage = () => {
        if (itemList.globalMessage === '') {
            throw new Error("Please enter your global message first.");
        } else {
            let msgObj = { from: itemList.localPeer.peerId, message: itemList.globalMessage };
            itemList.meeting.sendGlobalMessage(msgObj);
            updateItemList({ type: "updateGlobalMessageList", msgObj: msgObj });
        }
    }
    let setGlobalMessage = (message) => {
        updateItemList({ "type": "setGlobalMessage", "message": message });
    }
    let setLocalPeerName = (newName) => {
        updateItemList({ "type": "setLocalPeerName", "newName": newName });
        if (itemList.peerList) {
            itemList.meeting.updateLocalPeerName(itemList.localPeer.peerId, newName);
        }
    }
    let updateShareAudioState = (newState) => {
        let isShareAudio = (newState === "true");
        updateShareMedia(itemList.shareVideo, isShareAudio);
    }
    let updateShareVideoState = (newState) => {
        let isShareVideo = (newState === "true");
        updateShareMedia(isShareVideo, itemList.shareAudio);
    }
    let updateShareMedia = async (isShareVideo, isShareAudio) => {
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
            }
            updateItemList({ type: "updateShareMediaState", isShareAudio: isShareAudio, isShareVideo: isShareVideo, localStream: localStream });
        }
    }
    //=================================================================================================    
    let connectionTimeoutHandler = (msg) => {
        alert(msg);
        updateItemList({ type: "leaveMeeting" });
    }
    let genPeer = (newPeer, meeting) => {
        let peer = new Peer();
        peer.peerName = newPeer.peerName;
        peer.peerId = newPeer.peerId;
        peer.setConfig(WebRTC_Config);
        peer.setDebug(true);
        peer.init();
        peer.on("signal", signalData => {
            let temp = { from: itemList.localPeer.peerId, to: newPeer.peerId, signalData };
            let sendSignalDataResult = meeting.sendSignalData(temp);

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
    return [
        {
            globalMessage: itemList.globalMessage,
            globalMessageList: itemList.globalMessageList,
            isJoined: (itemList.peerList),
            "localPeer": itemList.localPeer,
            peerList: itemList.peerList,
            "localStream": itemList.localStream,
            "shareAudio": itemList.shareAudio,
            "shareVideo": itemList.shareVideo
        },
        {
            leaveMeeting,
            joinMeeting,
            sendGlobalMessage,
            setGlobalMessage,
            setLocalPeerName,
            updateShareAudioState,
            updateShareVideoState
        }];
}