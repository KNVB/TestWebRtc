import { useEffect, useRef,useState } from "react";
import LocalStreamManager from "../../util/LocalStreamManager";
import Meeting from "./util/Meeting";
import PeerList from "./PeerList";
export default function TestMeeting(){
    let localStreamManager=new LocalStreamManager();
    let peerList={};
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
    /*
    let meeting=new Meeting();
    meeting.on("data",(data,peer)=>{
        console.log("Rececived data ("+data+") from "+peer.name);
    });
    meeting.on("initialPeerList", (newPeerList) => { 
        peerList=newPeerList; 
      });
    meeting.on("newPeer", (peer) => {
      console.log("NEW Peer received.");
      console.log(peerList);
      peerList[peer.socketId]=peer;  
    });
    meeting.on("removePeer", (socketId) => {
        //peerList.current.removePeer(socketId);
    })
    meeting.on("stream",(param)=>{
      //console.log(param);
      //temp.setRemoteStream(param.peer.socketId,param.stream)
      //peerList.current.setStream(param.stream,param.peer);
    });
    meeting.init(peerName);
    */  
    let go=async()=>{
      let localStream;
      try{
        localStream =await localStreamManager.getMediaStream(true,true);
      }catch (error){
        console.log("Getting local media failure:"+error.message);
        localStream =null;
      }finally{
        meeting.setStream(localStream);
      }  
    }
    return(
      <>
        <PeerList peerList={peerList} />
        <button onClick={go}>Share Video</button>
      </>
    )
}