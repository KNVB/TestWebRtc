import { useEffect, useReducer } from "react";
import Meeting from "./Meeting";
import Peer from "./Peer";
let genPeer = (localPeer,peer, localStream) => {
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
    let newPeer = new Peer();
    newPeer.setPeerId(peer.peerId);
    newPeer.setPeerName(peer.peerName);
    newPeer.on("signal", signalData => {
        let temp = { from: localPeer.getPeerId(), to: peer.peerId, signalData };
        sendSignalData(temp);
    });
    newPeer.on("dataChannelMessage", message => {
        globalMessageHandler({ from: peer.peerName, message: message });
    });

    if (localStream) {
        newPeer.setStream(localStream);
    }
    newPeer.setConfig(webRtcConfig);
    newPeer.setDebug(true);
    newPeer.init();
    return newPeer;
}
let reducer = (state, action) => {
    let result = { ...state };
    let temp;

    switch (action.type) {
        case "addPeer":
            let newPeer = genPeer(result.localPeer,action.peer, result.localStream);
            if (result.peerList === null) {
                result.peerList = {};
            }
            result.peerList[newPeer.getPeerId()] = newPeer;
            break;
        case "init":
            result = action.itemList;
            break;
        case "initPeerList":
            temp = { ...state };
            temp.localPeer.setPeerId(action.obj.peerId);
            temp.peerList = {};
            for (const [newPeerId, tempPeer] of Object.entries(action.obj.peerList)) {
                let newPeer = genPeer(temp.localPeer,tempPeer, result.localStream);
                temp.peerList[newPeerId] = newPeer;
            }
            //temp.peerList = action.obj.peerList;
            result = temp;
            break;
        case "leaveMeeting":
            temp = { ...state };
            temp.globalMessageList = [];
            temp.localPeer = new Peer();
            temp.localStream = null;
            temp.peerList = null;
            result = temp;
            break;
        case "updatePeerList":
            result.peerList = action.peerList;
            break;
        case "updateLocalPeerName":
            result.localPeer.setPeerName(action.peerName);
            break
        default:
            break;
    }
    return result;
}
export function useMeeting() {
    const [itemList, updateItemList] = useReducer(reducer, {});
    useEffect(() => {
        let meeting = new Meeting();
        meeting.on("addPeer", peer => {
            updateItemList({ type: "addPeer", "peer": peer });
        });
        meeting.on("connectionTimeout", message => {
            alert(message);
            updateItemList({ type: "disconnect" });
        });
        meeting.on("globalMessage", messageObj => {
            updateItemList({ type: "updateGlobalMessage", messageObj: messageObj });
        })
        meeting.on("initPeerList", obj => {
            updateItemList({ type: "initPeerList", "obj": obj });
        });
        let temp = {
            globalMessageList: [],
            localPeer: new Peer(),
            localStream: null,
            "meeting": meeting,
            peerList: null,
        }
        updateItemList({ type: "init", "itemList": temp });
    }, [])
    let join = (path) => {
        if (itemList.localPeer.getPeerName() === '') {
            throw new Error("Please enter your alias.");
        } else {
            itemList.meeting.join(path, itemList.localPeer, itemList.localStream);
        }
    }
    let leave = () => {
        itemList.meeting.leave();
        updateItemList({ type: "leaveMeeting" });
    }
    let sendGlobalMessage = msg => {
    }
    let updateLocalPeerName = peerName => {
        updateItemList({ type: "updateLocalPeerName", "peerName": peerName });
    }
    let updateShareMedia = (shareAudio, shareVideo) => {

    }
    return [
        itemList.globalMessageList, itemList.localPeer,
        itemList.peerList, itemList.localStream,
        join, leave, sendGlobalMessage,
        updateLocalPeerName, updateShareMedia
    ];
}