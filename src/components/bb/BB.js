import { useEffect, useReducer, useRef } from "react";
import io from "socket.io-client";
import Meeting from "./Meeting";
import PeerList from "./PeerList";
export default function BB() {
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
  let socket = io.connect(process.env.REACT_APP_SOCKET_URL + "testMeeting", {
    transports: ["websocket"],
  });
  useEffect(() => {
    socket.emit("hi", peerName, (response) => {
      console.log("=======================hi===============");
      peerList.current.setPeerList(response.peerList);
    });
    socket.on("newPeer", (peer) => {
      peerList.current.addPeer(peer);
    });
    socket.on("removePeer", (socketId) => {
      peerList.current.removePeer(socketId);
    });
  },[peerName,socket]);

  return <PeerList ref={peerList} />;
}
