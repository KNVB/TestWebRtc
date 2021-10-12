import { useEffect, useReducer } from "react";
import io from "socket.io-client";
import LocalStreamManager from "../../util/LocalStreamManager";
import PeerList from "./PeerList";
export default function TestSocket() {
  let initialPeerList={};
  let localStreamManager = new LocalStreamManager();
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
      dispatch({type:"setPeerList",newPeerList:response.peerList});
      //setPeerList(response.peerList);
    });
    socket.on("newPeer", peer => {
      console.log("NEW peer:"+JSON.stringify(peer));
      dispatch({"type":"newPeer",newPeer:peer});
    });
    
    socket.on("removePeer", (socketId) => {
      console.log("remove peer event received.");
      dispatch({"type":"removePeer","socketId":socketId});
    });
  },[]);
  let reducer=(state,action)=>{
    let result;
    switch(action.type){
      case "newPeer":
        //console.log(state);
        result={...state,[action.newPeer.socketId]:action.newPeer};
        //console.log("after:"+JSON.stringify(result));
        break;
      case "removePeer":
        console.log("before:"+JSON.stringify(result));
        result={...state}
        delete result[action.socketId];
        console.log("after:"+JSON.stringify(result));
        break;  
      case "setPeerList":
        result={...action.newPeerList};
        break;
      default:
        result=state;
        break;
    }
    return result;
  }
  const[peerList,dispatch]=useReducer(reducer,initialPeerList);
  return (
    <>
      <PeerList peerList={peerList} />
      <button onClick={go}>Share Video</button>
    </>
  )
}