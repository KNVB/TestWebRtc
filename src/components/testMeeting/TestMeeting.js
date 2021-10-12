import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import LocalStreamManager from "../../util/LocalStreamManager";
import PeerList from "./PeerList";
export default function TestMeeting() {
  let localStreamManager = new LocalStreamManager();
  const [peerList,setPeerList]=useState({});
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
  let go = async () => {
    let localStream;
    try {
      localStream = await localStreamManager.getMediaStream(true, true);
    } catch (error) {
      console.log("Getting local media failure:" + error.message);
      localStream = null;
    } finally {
      //meeting.current.setStream(localStream);
    }
  }

  let socket = io.connect(process.env.REACT_APP_SOCKET_URL + "testMeeting", {
    transports: ["websocket"],
  });
    
  useEffect(()=>{
    socket.emit("hi", peerName, (response) => {
      console.log("Say hi to peer.");
      setPeerList(response.peerList);
    });
    socket.on("newPeer", peer => {
      console.log("NEW peer:"+JSON.stringify(peer));
      //console.log("Old peerList:"+JSON.stringify(peerList));
      console.log(peerList);
    });  
  },[setPeerList])
  return (
    <>
      <PeerList peerList={peerList} />
      <button onClick={go}>Share Video</button>
    </>
  )
}