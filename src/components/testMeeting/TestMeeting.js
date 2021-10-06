import {useEffect,useState,useRef} from 'react';
import io from 'socket.io-client';
import Peer from './Peer';
export default function TestMeeting(){
    let peerName;
    const [peerList,setPeerList]=useState({});
    const [signalSocket,setSignalSocket]=useState(io.connect(process.env.REACT_APP_SOCKET_URL+"testMeeting", { transports: ['websocket'] }));
    //let signalSocket=io.connect(process.env.REACT_APP_SOCKET_URL+"testMeeting", { transports: ['websocket'] });
    let sUsrAg = navigator.userAgent;
    if (sUsrAg.indexOf("Edg")>-1){
        peerName="Edge";
    }else{
        if (sUsrAg.indexOf("Chrome")>-1){
            peerName="Chrome";
        }else {
            if (sUsrAg.indexOf("Firefox")>-1){
                peerName="Firefox";
            } else {
                if (sUsrAg.indexOf("Safari")>-1){
                    peerName="Safari";
                }
            }
        }
    }
  
    useEffect(()=>{
        signalSocket.on("greeting",greeting=>{
            console.log("Receive greeting from:"+greeting.from);
            let peer=new Peer(greeting.from,greeting.socketId);        
            let temp={...peerList};
            temp[greeting.socketId]=peer;
            setPeerList(temp);
        })
        signalSocket.on("newPeerAdded",(remotePeer)=>{
            console.log("newPeerAdded:"+remotePeer.from);
            let peer=new Peer(remotePeer.from,remotePeer.socketId);
            let temp={...peerList};
            temp[remotePeer.socketId]=peer;
            setPeerList(temp);
        });    
    },[signalSocket,peerList,peerName])
    let connect=()=>{
        signalSocket.emit("newPeer",peerName);
    }
    console.log(peerList);
    return(
        <div>
            <button onClick={connect}>Connect</button>
            <div>
              {
                  Object.keys(peerList).map((key,index) => (
                      <div key={index}>
                          {peerList[key].peerName()}
                      </div>
                  ))
              }  
            </div>
        </div>
    );
   
}