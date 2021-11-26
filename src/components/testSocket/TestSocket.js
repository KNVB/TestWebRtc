import { useEffect, useReducer } from "react";
import LocalStreamManager from "../../util/LocalStreamManager";
import Meeting from "./Meeting";
import PeerElement from './PeerElement';
export default function TestSocket() {
    let localStreamManager = new LocalStreamManager();
    let reducer = (state, action) => {
        let result = { ...state };
        switch (action.type) {
            case "disconnect":
                result.meeting.leave();
                break;
            case "initMeetingObj":
                result.meeting = action.meeting;
                result.peerId = action.peerId;
                result.peerList = action.peerList;
                break;
            case "newPeer":
                result.peerList[action.newPeer.peerId] = action.newPeer;
                break;
            case "removePeer":
                action.peerIdList.forEach(peerId => {
                    delete result.peerList[peerId];
                })
                break;
            default:
                break;
        }
        return result;
    }
    useEffect(() => {
        let peerName;
        let sUsrAg = navigator.userAgent;
        if (sUsrAg.indexOf("Edg") > -1) {
            peerName = "Edge";
        } else {
            if (sUsrAg.indexOf("Chrome") > -1) {
                peerName = "Chrome";
            } else {
                if (sUsrAg.indexOf("Firefox") > -1) {
                    peerName = "Firefox";
                } else {
                    if (sUsrAg.indexOf("Safari") > -1) {
                        peerName = "Safari";
                    }
                }
            }
        }
        let meeting = new Meeting();
        meeting.setDebug(true);
        meeting.setSignalServerURL(process.env.REACT_APP_SOCKET_URL + "b");
        meeting.on("initMeeting", (peerId, peerList) => {
            console.log("initMeeting event received.");
            updateItemList({ type: "initMeetingObj", meeting: meeting, peerId: peerId, peerList: peerList });
        });
        meeting.on("newPeer", newPeer => {
            updateItemList({ type: "newPeer", newPeer: newPeer });
        });
        meeting.on("peerReconnect", peer => {
            console.log("Peer " + peer.name + " reconnected");
        });
        meeting.on("refreshSocketId", response => {
            console.log(response);
        });
        meeting.on("removePeer", peerIdList => {
            updateItemList({ type: "removePeer", peerIdList: peerIdList });
        });
        meeting.connect();
        meeting.join(peerName);
      
    }, []);

    let peerElementList = [];
    const [itemList, updateItemList] = useReducer(reducer, { meeting: null, peerId: null, peerList: {} });
    let disconnect = () => {
        updateItemList({ type: "disconnect" });
    }
    let go = async () => {
        let localStream;
        try {
          localStream = await localStreamManager.getMediaStream(true, false);
        } catch (error) {
          console.log("Getting local media failure:" + error.message);
          localStream = null;
        } finally {
          itemList.meeting.setLocalStream(localStream);
        }
      }; 
    if (itemList.peerList) {
        Object.keys(itemList.peerList).forEach((peerId) => {
            peerElementList.push(<PeerElement key={peerId} peer={itemList.peerList[peerId]} meeting={itemList.meeting}/>);
        });
    }
    return (
        <>
            <button onClick={go}>Share Video</button>
            {peerElementList}
            <button onClick={disconnect}>Disconnect</button>
        </>
    )
}