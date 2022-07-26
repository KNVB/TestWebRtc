import { useEffect, useReducer } from "react";
import Meeting from "./Meeting";

let reducer = (state, action) => {
    let result = { ...state };
    let temp;
    switch (action.type) {
        case "init":
            temp = { "meeting": action.meeting }
            result = temp;
            break;
        case "initPeerList":
            temp={...result.meeting};
            temp.setLocalPeerId(action.obj.localPeerId);
            temp.setPeerList(action.obj.peerList);
            result.meeting={...temp};
            break;    
        case "updateLocalPeerName":
            temp = { ...result };
            temp.meeting.setLocalPeerName(action.peerName);
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
        meeting.on("initPeerList",obj=>{
            updateItemList({ type: "initPeerList","obj":obj});
        });
        meeting.on("globalMessage", messageObj => {
            updateItemList({ type: "updateGlobalMessage", messageObj: messageObj });
        })
        updateItemList({ "type": "init", "meeting": meeting })
    }, []);
    let joinMeeting = (path) => {
        if (itemList.meeting.getLocalPeerName() === '') {
            throw new Error("Please enter your alias first.");
        } else {
            itemList.meeting.join(path);
        }
    }
    let updateLocalPeerName = peerName => {
        updateItemList({ "type": "updateLocalPeerName", "peerName": peerName })
    }
    return [itemList.meeting,
    {
        "joinMeeting": joinMeeting,
        "setLocalPeerName": updateLocalPeerName
    }];
}