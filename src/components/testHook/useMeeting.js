import { useEffect, useReducer } from "react";
import Meeting from "./Meeting";
import Peer from "./Peer";
let reducer = (state, action) => {
    let result = { ...state };
    let temp;
    switch (action.type) {
        case "init":
            result = { ...action.obj };
            break;
        case "initPeerList":
            temp = { ...result };
            temp.localPeer.setPeerId(action.obj.localPeerId);
            temp.peerList = action.obj.peerList;
            result = { ...temp };
            break;
        case "leaveMeeting":
            temp = { ...result };
            temp.meeting.leave();
            temp.globalMessageList=[];
            temp["localPeer"]=new Peer();
            temp["localStream"]=null;            
            temp["peerList"]=null;
            temp["shareAudio"]=false;
            temp["shareVideo"]=false;
            result = { ...temp };
            break
        case "updateLocalPeerName":
            temp = { ...result };
            temp.localPeer.setPeerName(action.peerName);
            result = temp;
            break;
        default:
            break;
    }
    return result;
}
export function useMeeting() {
    const [itemList, updateItemList] = useReducer(reducer, {});
    useEffect(() => {
        let meeting = new Meeting();
        meeting.on("peerListUpdated", peerList => {
            updateItemList({ type: "updatePeerList", peerList: peerList });
        });
        meeting.on("connectionTimeout", message => {
            alert(message);
            updateItemList({ type: "disconnect" });
        });
        meeting.on("initPeerList", obj => {
            updateItemList({ type: "initPeerList", "obj": obj });
        });
        meeting.on("globalMessage", messageObj => {
            updateItemList({ type: "updateGlobalMessage", messageObj: messageObj });
        })
        let obj = {
            globalMessageList: [],
            "localPeer": new Peer(),
            "localStream": null,
            "meeting": meeting,
            "peerList": null,
            "shareAudio": false,
            "shareVideo": false,
        }
        updateItemList({ "type": "init", "obj": obj })
    }, []);
    let joinMeeting = (path) => {
        if (itemList.localPeer.getPeerName() === '') {
            throw new Error("Please enter your alias first.");
        } else {
            itemList.meeting.join(path,itemList.localPeer);
        }
    }
    let leaveMeeting=()=>{
        updateItemList({ "type":"leaveMeeting"});
    }
    let updateLocalPeerName = peerName => {
        updateItemList({ "type": "updateLocalPeerName", "peerName": peerName })
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
            "leaveMeeting":leaveMeeting,
            "joinMeeting": joinMeeting,
            "setLocalPeerName": updateLocalPeerName
        }];
}