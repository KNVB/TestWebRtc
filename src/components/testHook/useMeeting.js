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
let webRtcConfig = {
    iceServers: [
        {
            urls: "turn:numb.viagenie.ca",
            credential: "turnserver",
            username: "sj0016092@gmail.com",
        },
        {
            urls: ["turn:openrelay.metered.ca:443?transport=tcp"],
            username: "openrelayproject",
            credential: "openrelayproject",
        },
        {
            urls: "turn:numb.viagenie.ca",
            credential: "turnserver",
            username: "sj0016092@gmail.com",
        },
        {
            urls: [
                "stun:stun.l.google.com:19302",
                "stun:stun1.l.google.com:19302",
                "stun:stun2.l.google.com:19302",
                "stun:stun3.l.google.com:19302",
                "stun:stun4.l.google.com:19302",
            ]
        },
    ]
    /*
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
    */
};

let reducer = (state, action) => {
    let result = { ...state };
    let temp;
    console.log(action);
    switch (action.type) {
        case "initMeeting":
            result.meeting = action.meeting;
            break;
        case "initPeerList":
            result.localPeer.setPeerId(action.localPeerId);
            result.peerList = { ...action.peerList };
            break;
        case "leaveMeeting":
            result = action.obj;
            break;
        case "newPeer":
            action.newPeer.setStream(result.localStream);
            action.newPeer.isCall = true;
            action.newPeer.call();
            result.peerList[action.newPeer.getPeerId()] = action.newPeer;
            break;
        case "removePeerId":
            action.removePeerIdList.forEach(peerId => {
                if (result.peerList[peerId]) {
                    result.peerList[peerId].hangUp();
                    delete result.peerList[peerId];
                }
            })
            break;
        case "signalPeer":
            result.peerList[action.signalObj.from].signal(action.signalObj);
            break;
        case "setLocalPeerName":
            result.localPeer.setPeerName(action.newName);
            break;
        case "updateGlobalMessageList":
            let fromPeer;
            if (result.localPeer.getPeerId() === action.msgObj.from) {
                fromPeer = result.localPeer;
            } else {
                fromPeer = result.peerList[action.msgObj.from];
            }
            temp = [{ from: fromPeer.getPeerName(), message: action.msgObj.message }];
            temp = temp.concat(result.globalMessageList);
            result.globalMessageList = temp;
            break;
        case "updatePeerName":
            result.peerList[action.peer.peerId].setPeerName(action.peer.peerName);
            break
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
    useEffect(() => {
        let meeting = new Meeting();
        meeting.setDebug(true);
        meeting.on("globalMessage", msgObj => {
            updateItemList({ type: "updateGlobalMessageList", "msgObj": msgObj });
        });
        meeting.on("initPeerList", obj => {
            let peerList = {}
            for (const [newPeerId, tempPeer] of Object.entries(obj.peerList)) {
                let peer = genPeer(tempPeer, meeting);
                peerList[newPeerId] = peer;
            }
            updateItemList({ type: "initPeerList", localPeerId: obj.peerId, "peerList": peerList });
        });
        meeting.on("newPeerEvent", newPeer => {
            let peer = genPeer(newPeer, meeting);            
            updateItemList({ type: "newPeer", "newPeer": peer });
        })
        meeting.on("removePeerIdList", list => {
            updateItemList({ type: "removePeerId", removePeerIdList: list });
        });
        meeting.on("signalEvent", signalObj => {
            console.log("====Receive Signal Event Start====");
            updateItemList({ type: "signalPeer", signalObj: signalObj });
            console.log("====Receive Signal Event End====");
        });
        meeting.on("updatePeerNameEvent", peer => {
            updateItemList({ type: "updatePeerName", peer: peer });
        });
        updateItemList({ type: "initMeeting", "meeting": meeting });
    }, []);
    let connectionTimeoutHandler = message => {
        alert(message);
        console.log(itemList);
    }
    let genPeer = (newPeer, meeting) => {
        let peer = new Peer();        
        peer.setPeerName(newPeer.peerName);
        peer.setPeerId(newPeer.peerId);
        peer.setConfig(webRtcConfig);
        peer.setDebug(true);
        peer.init();
        peer.on("signal", signalData => {
            let temp = { from: itemList.localPeer.getPeerId(), to: newPeer.peerId, signalData };
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
    let leaveMeeting = async () => {
        Object.values(itemList.peerList).forEach(peer => {
            peer.hangUp();
        });
        if (itemList.localStream) {
            await itemList.localStreamManager.closeStream(itemList.localStream);
        }
        itemList.meeting.leave();
        let temp = { ...obj };
        temp.meeting = itemList.meeting;
        updateItemList({ type: "leaveMeeting", "obj": temp });
    }
    let joinMeeting = (path) => {
        if (itemList.localPeer.getPeerName() === '') {
            throw new Error("Please enter your alias first.")
        } else {
            itemList.meeting.join(path, itemList.localPeer);
        }
    }
    let sendGlobalMessage = (msg) => {
        let msgObj = { from: itemList.localPeer.getPeerId(), message: msg }
        itemList.meeting.sendGlobalMessage(msgObj);
        updateItemList({ type: "updateGlobalMessageList", msgObj: msgObj });
    }
    let setLocalPeerName = (newName) => {
        if (newName !== '') {
            itemList.meeting.updateLocalPeerName({ peerId: itemList.localPeer.getPeerId(), peerName: newName });
        }
        updateItemList({ "type": "setLocalPeerName", "newName": newName });
    }
    let updateShareAudioState = (newState) => {
        let isShareAudio = (newState === "true");
        updateShareMedia(itemList.shareVideo, isShareAudio);
    }
    let updateShareVideoState = async (newState) => {
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
            if (itemList.localStream){
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
            leaveMeeting,
            joinMeeting,
            sendGlobalMessage,
            setLocalPeerName,
            updateShareAudioState,
            updateShareVideoState
        }];
}