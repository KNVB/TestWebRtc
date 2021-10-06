import { useEffect, useState } from "react";
import io from "socket.io-client";
import Peer from "./Peer";
import PeerList from "./PeerList";
export default function B() {
  
  const [signalSocket,setSignalSocket]=useState();
  
  useEffect(() => {
    let temp=io.connect(process.env.REACT_APP_SOCKET_URL + "testMeeting", {
        transports: ["websocket"],
      })
    setSignalSocket(temp);  
  },[setSignalSocket]);
  
  return(
    <>
        {signalSocket && <PeerList signalSocket={signalSocket}/>}
    </>
  )
}
