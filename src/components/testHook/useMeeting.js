import { useEffect,useReducer } from "react";
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
    switch (action.type) {
        case "initMeeting":
            result.meeting=action.meeting;
            break;
        case "initPeerList":
            result.localPeer.setPeerId(action.localPeerId);
            result.peerList=action.peerList;
            break
        case "newPeer":
            result.peerList[action.newPeer.getPeerId()]=action.newPeer;
            break;    
        case "setLocalPeerName":
            result.localPeer.setPeerName(action.newName);
            break;
        default:
            break;
    }
    return result;
}
export function useMeeting() {
    const [itemList, updateItemList] = useReducer(reducer, obj);
    useEffect(()=>{
        let meeting=new Meeting();
        meeting.setDebug(true);
        meeting.on("initPeerList",obj=>{
            let peerList={}
            for (const [newPeerId, tempPeer] of Object.entries(obj.peerList)){
                let peer=new Peer();
                peer.setPeerName(tempPeer.peerName);
                peer.setPeerId(newPeerId);
                peerList[newPeerId]=peer;
            }
            updateItemList({type:"initPeerList",localPeerId:obj.peerId,"peerList":peerList});        
        });
        meeting.on("newPeerEvent",newPeer=>{
            let peer=new Peer();
            peer.setPeerName(newPeer.peerName);
            peer.setPeerId(newPeer.peerId);
            peer.isCall = true;
            peer.call();
            updateItemList({type:"newPeer", "newPeer":peer});
        })
        updateItemList({type:"initMeeting","meeting":meeting});
    },[])
    let leaveMeeting = () => {

    }
    let joinMeeting = (path) => {
        if (itemList.localPeer.getPeerName() === ''){
            throw new Error("Please enter your alias first.")
        }else{
            itemList.meeting.join(path,itemList.localPeer);
        }
    }
    let sendGlobalMessage = () => {

    }
    let setLocalPeerName = (newName) => { 
        updateItemList({"type":"setLocalPeerName","newName":newName})
    }
    let updateShareAudioState = (newState) => { }
    let updateShareVideoState = (newState) => { }
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