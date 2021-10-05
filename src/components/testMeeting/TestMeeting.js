import {useEffect,useState,useRef} from 'react';
import io from 'socket.io-client';
import Peer from './Peer';
export default function TestMeeting(){
    let peerName;
    const [peerList,setPeerList]=useState({});
    let signalSocket=io.connect(process.env.REACT_APP_SOCKET_URL+"testMeeting", { transports: ['websocket'] });
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
            console.log(peerList);
            let temp={...peerList};
            let peer=new Peer(greeting.from,greeting.socketId);
            
            temp[greeting.socketId]=peer;
            setPeerList(temp);
            //console.log("Receive Greeting from "+greeting.from);
            //console.log(peerList);
        })
        signalSocket.on("newPeer",(remotePeer)=>{
            //console.log(remotePeer);
            let peer=new Peer(remotePeer.from,remotePeer.socketId);
            peerList[remotePeer.socketId]=peer;
            //console.log(peerList[remotePeer.socketId].peerName());
            signalSocket.emit("sayHi",{socketId:remotePeer.socketId,"peerName":peerName});
        });
    },[signalSocket,peerList]);
    let connect=()=>{
        signalSocket.emit("newPeer",peerName);
    }
    console.log(peerList);
    return(
        <div>
            <button onClick={connect}>Connect</button>
            <div>
                
            </div>
        </div>
    );
}