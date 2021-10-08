import { useEffect, useRef } from "react";

import Meeting from "./Meeting";
import PeerList from "./PeerList";
export default function TestMeeting() {
  let peerName;
  const peerList = useRef();
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
    let meeting = new Meeting();
    meeting.on("data",(data,peer)=>{
      console.log("Rececived data ("+data+") from "+peer.name);
    });
    meeting.on("initialPeerList", (newPeerList) => { 
      peerList.current.setPeerList(newPeerList); 
    });
    meeting.on("newPeer", (peer) => {
      peerList.current.addPeer(peer);
    });
    meeting.on("removePeer", (socketId) => {
      peerList.current.removePeer(socketId);
    })
    meeting.on("stream",()=>{
      
    });
    meeting.init(peerName);
  }, [])
  return <PeerList ref={peerList} />;
}
