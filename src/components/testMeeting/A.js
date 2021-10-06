import { useEffect, useState } from "react";
import io from "socket.io-client";
import Peer from "./Peer";
export default function A() {
  let peerName;
  const [peerList, setPeerList] = useState({});
  const [signalSocket,setSignalSocket]=useState();
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
    let temp=io.connect(process.env.REACT_APP_SOCKET_URL + "testMeeting", {
        transports: ["websocket"],
      })
    temp.emit("hi", peerName, (response) => {
        console.log("=======================hi===============");
        setPeerList(response.peerList);
    });  
    setSignalSocket(temp);  
  },[setSignalSocket]);
  useEffect(() => {
    if (signalSocket){
        signalSocket.on("newPeer", (peer) => {
            let temp={...peerList};
            console.log("=======================new peer===============");              
            console.log(peer);
            console.log("==================old peer list===============");
            console.log(peerList);
            console.log("==================new peer list===============");
            temp[peer.socketId]=peer;
            console.log(temp);
            setPeerList(temp);
        });
    }
  },[signalSocket]);
  return (
    <>
      {Object.keys(peerList).map((key, index) => (
        <div key={index}>{peerList[key].name}</div>
      ))}
    </>
  );
}
