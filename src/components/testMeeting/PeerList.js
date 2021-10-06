import { useEffect, useState } from "react";
export default function PeerList({ signalSocket }) {
  let peerName;
  const [peerList, setPeerList] = useState({});
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
    let addPeer = (peer) => {
      let temp = { ...peerList };
      temp[peer.socketId] = peer;
      setPeerList(temp);
    };
    let initializePeerList = (initialPeerList) => {
      setPeerList(initialPeerList);
    };
    signalSocket.emit("hi", peerName, (response) => {
      console.log("=======================hi===============");
      initializePeerList(response.peerList);
    });
    signalSocket.on("newPeer", addPeer);
    return () => {
      signalSocket.off("newPeer", addPeer);
    };
  }, [signalSocket]);
  return Object.keys(peerList).map((key, index) => (
    <div key={index}>{peerList[key].name}</div>
  ));
}
