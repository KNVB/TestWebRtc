import { useEffect, useRef, useState } from "react";
import LocalStreamManager from "../../util/LocalStreamManager";
import Meeting from "./util/Meeting";
import PeerList from "./PeerList";
export default function TestMeeting() {
    let localStreamManager = new LocalStreamManager();
    const [meeting, setMeeting] = useState();
    let peerList = useRef();
    let go = async () => {
        let localStream;
        try {
            localStream = await localStreamManager.getMediaStream(true, false);
        } catch (error) {
            console.log("Getting local media failure:" + error.message);
            localStream = null;
        } finally {
            meeting.setLocalStream(localStream);
        }
    };
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
    useEffect(() => {
        let temp = new Meeting();
        temp.setDebug(true);
        temp.on("data", param => {
            console.log("Data Event Recevied:" + JSON.stringify(param));
        })
        temp.on("initialPeerList", (newPeerList) => {
            console.log("initialPeerList event recevied");
            peerList.current.setPeerList(newPeerList);
        });
        temp.on("newPeer", (newPeer) => {
            console.log("newPeer event recevied");
            peerList.current.addPeer(newPeer);
        });
        temp.on("removePeer", socketId => {
            console.log("removePeer event recevied");
            peerList.current.removePeer(socketId);
        });
        temp.on("stream", param => {
            console.log("A stream event received:" + JSON.stringify(param));
            peerList.current.setRemoteStream(param.stream,param.peer);
        })
        temp.join(peerName);
        setMeeting(temp);
    }, [peerName]);
    return (
        <>
            <PeerList ref={peerList} />
            <button onClick={go}>Share Video</button>
        </>
    )
}