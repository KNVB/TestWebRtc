import { useEffect, useReducer} from "react";
import Meeting from "./Meeting";

export default function TestSocket(){
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
    useEffect(()=>{
        let meeting=new Meeting();
        meeting.on("newPeer",peer=>{
            console.log("newPeer event occured.");
            updatePeerList({type:"newPeer","newPeer":peer});
        });
        meeting.on("setPeerList",initialPeerList=>{
            console.log("setPeerList event occured.");
            updatePeerList({type:"setPeerList","peerList":initialPeerList});
        });
        meeting.on("removePeer",socketId=>{
            console.log("removePeer event occured.");
            updatePeerList({type:"removePeer","socketId":socketId});
        });
        meeting.join(peerName);
    },[peerName]);
    let reducer = (state, action) => {
        let result = { ...state };
        switch (action.type){
            case "newPeer":
                result[action.newPeer.socketId]=action.newPeer;
                break;
            case "removePeer":
                delete result[action.socketId];
                break;
            case "setPeerList":
                result={...action.peerList};
                break;                
            default:
                break;
        }
        return result;
    }
    const [peerList, updatePeerList] = useReducer(reducer, {});
    console.log(peerList);
    return (
        <></>
    )
}