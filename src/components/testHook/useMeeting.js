import { useEffect, useReducer } from "react";
import LocalStreamManager from '../../util/LocalStreamManager';
import Meeting from "./Meeting";
import Peer from "./Peer";
let obj = {
    globalMessageList: [],
    "localPeer": new Peer(),
    "localStream": null,
    "localStreamManager": new LocalStreamManager(),
    "peerList": null,
    "shareAudio": false,
    "shareVideo": false,
}

let reducer = (state, action) => {
    let result = { ...state };
    let temp;
    switch (action.type) {
        case "initMeeting":
            result.meeting = action.meetingObj;
            break;
        case "initPeerList":
            temp = { ...result };
            temp.localPeer.setPeerId(action.obj.localPeerId);
            temp.peerList = action.obj.peerList;
            result = { ...temp };
            break;
        case "leaveMeeting":
            temp = { ...result };
            if (temp.peerList) {
                temp.peerList.forEach(peer => {
                    peer.hangUp();
                })
            }
            temp.meeting.leave();
            temp.globalMessageList = [];
            temp["localPeer"] = new Peer();
            temp["localStream"] = null;
            temp["peerList"] = null;
            temp["shareAudio"] = false;
            temp["shareVideo"] = false;
            result = { ...temp };
            break
        case "newPeerEvent":
            temp = [...result.peerList];
            temp.push(action.newPeer);
            result.peerList = temp;
            break;
        case "reconnectEvent":
            temp = result.peerList.filter(peer => peer.getPeerId() === action.peerId);
            temp.restartICE();
            break;
        case "removePeerId":
            temp = result.peerList.filter(peer =>
                (!action.list.includes(peer.getPeerId()))
            );
            result.peerList = temp;
            break;
        case "signal":
            temp = [...result.peerList];
            let pp = temp.find(peer => peer.getPeerId() === action.signalObj.from);
            pp.signal(action.signalObj);
            result.peerList = temp;
            break;
        case "updateGlobalMessageList":
            temp = [action.messageObj];
            temp = temp.concat(result.globalMessageList);
            result.globalMessageList = temp;
            break;
        case "updateLocalPeerName":
            temp = { ...result };
            temp.localPeer.setPeerName(action.peerName);
            result = temp;
            break;
        case "updateShareAudioState":
            temp = { ...result };
            temp["shareAudio"] = action.state;
            temp["localStream"] = action.localStream;
            result = temp;
            break;
        case "updateShareVideoState":
            temp = { ...result };
            temp["shareVideo"] = action.state;
            temp["localStream"] = action.localStream;
            result = temp;
            break;
        default:
            break;
    }
    return result;
}
export function useMeeting() {
    const [itemList, updateItemList] = useReducer(reducer, obj);
    useEffect(() => {
        let meeting = new Meeting();
        meeting.setDebug(true);
        meeting.on("connectionTimeout", message => {
            alert(message);
            updateItemList({ "type": "leaveMeeting" });
        });
        meeting.on("initPeerList", obj => {
            updateItemList({ type: "initPeerList", "obj": obj });
        });
        meeting.on("globalMessage", messageObj => {
            updateItemList({ type: "updateGlobalMessageList", "messageObj": messageObj });
        })
        meeting.on("newPeerEvent", newPeer => {
            updateItemList({ type: "newPeerEvent", "newPeer": newPeer });
        });
        meeting.on("reconnectEvent", reconnectPeerId => {
            updateItemList({ type: "reconnectEvent", peerId: reconnectPeerId });
        });
        meeting.on("removePeerId", list => {
            updateItemList({ type: "removePeerId", "list": list });
        });
        meeting.on("signal", signalObj => {
            updateItemList({ type: "signal", signalObj: signalObj });
        })
        updateItemList({ "type": "initMeeting", "meetingObj": meeting })
    }, []);
    let joinMeeting = (path) => {
        if (itemList.localPeer.getPeerName() === '') {
            throw new Error("Please enter your alias first.");
        } else {
            itemList.meeting.join(path, itemList.localPeer);
        }
    }
    let leaveMeeting = () => {
        updateItemList({ "type": "leaveMeeting" });
    }
    let sendGlobalMessage = (msg) => {
        let msgObj = { from: itemList.localPeer.getPeerName(), message: msg };
        itemList.peerList.forEach(peer => {
            peer.sendMessage(JSON.stringify(msgObj));
        });
        updateItemList({ "type": "updateGlobalMessageList", "messageObj": msgObj });
    }
    let updateLocalPeerName = peerName => {
        updateItemList({ "type": "updateLocalPeerName", "peerName": peerName })
    }
    let updateShareAudioState = async shareAudioState => {
        let localStream;
        let isShareAudio = (shareAudioState === "true");
        try {
            localStream = await itemList.localStreamManager.getMediaStream(itemList.shareVideo, isShareAudio);
            itemList.peerList.forEach(peer => {
                peer.setStream(localStream);
            });
        } catch (error) {
            console.log("Get Media Stream failure:" + error.message);
            localStream = null;
        } finally {
            if (localStream === null) {
                await itemList.localStreamManager.closeStream(itemList.localStream);
            }
            updateItemList({ "type": "updateShareAudioState", "localStream": localStream, state: isShareAudio });
        }
    }
    let updateShareVideoState = async shareVideoState => {
        let localStream;
        let isShareVideo = (shareVideoState === "true");
        try {
            localStream = await itemList.localStreamManager.getMediaStream(isShareVideo, itemList.shareAudio);
            itemList.peerList.forEach(peer => {
                peer.setStream(localStream);
            });
        } catch (error) {
            console.log("Get Media Stream failure:" + error.message);
            localStream = null;
        } finally {
            if (localStream === null) {
                await itemList.localStreamManager.closeStream(itemList.localStream);
            }
            updateItemList({ "type": "updateShareVideoState", "localStream": localStream, state: isShareVideo });
        }
    }
    
    return [
        {
            globalMessageList: itemList.globalMessageList,
            "localPeer": itemList.localPeer,
            peerList: itemList.peerList,
            "localStream": itemList.localStream,
            "shareAudio": itemList.shareAudio,
            "shareVideo": itemList.shareVideo
        },
        {
            "leaveMeeting": leaveMeeting,
            "joinMeeting": joinMeeting,
            "sendGlobalMessage": sendGlobalMessage,
            "setLocalPeerName": updateLocalPeerName,
            "updateShareAudioState": updateShareAudioState,
            "updateShareVideoState": updateShareVideoState
        }];
}