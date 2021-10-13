import { useEffect, useReducer } from "react";
import Meeting from "./util/Meeting";
import LocalStreamManager from "../../util/LocalStreamManager";
import PeerList from "./PeerList";
export default function TestMeeting() {
  let initialState = {meeting:new Meeting(),peerList:{}};
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
      localStream = await localStreamManager.getMediaStream(true, false);
    } catch (error) {
      console.log("Getting local media failure:" + error.message);
      localStream = null;
    } finally {
      state.meeting.setStream(localStream);
    }
  };
  useEffect(() => {
    state.meeting.on("initialPeerList", newPeerList => {
        dispatch({type:"setPeerList","newPeerList":newPeerList})
    });
    state.meeting.on("newPeer",newPeer=>{
        dispatch({type:"newPeer","newPeer":newPeer});
    });
    state.meeting.on("removePeer",socketId=>{
        dispatch({type:"removePeer","socketId":socketId});
    });
    state.meeting.on("stream",param=>{
        console.log("Stream Event Received:"+JSON.stringify(param));
        dispatch({type:"setRemoteStream","socketId":param.peer.socketId,stream:param.stream});
    })    
    state.meeting.init(peerName);
  }, []);
  let reducer = (state, action) => {
    let result;
    switch(action.type){
        case "newPeer":
            result={...state};
            result.peerList[action.newPeer.socketId]=action.newPeer;
            break;
        case "removePeer":
            result={...state}
            delete result.peerList[action.socketId];
            break;    
        case "setPeerList":
            result={...state};
            result.peerList={...action.newPeerList};
            break;
        case "setRemoteStream":
            result={...state};
            document.getElementById(action.socketId).srcObject=action.stream;
            //result.peerList[action.socketId].stream=action.stream;
            break;        
        default:
            result=state;
            break;
    }
    return result;
  };
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      <PeerList peerList={state.peerList} />
      <button onClick={go}>Share Video</button>
    </>
  );
}
