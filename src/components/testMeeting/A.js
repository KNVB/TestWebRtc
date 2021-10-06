import {useEffect,useReducer,useState} from 'react';
import io from 'socket.io-client';
import Peer from './Peer';
export default function(){
    const[peerList,setPeerList]=useState({});
    const [signalSocket,setSignalSocket]=useState(io.connect(process.env.REACT_APP_SOCKET_URL+"testMeeting", { transports: ['websocket'] }));
    let peerName;
    //let signalSocket=io.connect(process.env.REACT_APP_SOCKET_URL+"testMeeting", { transports: ['websocket'] })
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
        signalSocket.emit("newPeer",peerName,response=>{
            setPeerList(response.peerList);
        });
        signalSocket.on("newPeerAdded",peer=>{
            console.log(Object.keys(peerList).length);
            /*
            let temp={...peerList};
            temp[peer.socketId]=peer;
            setPeerList(temp);
            */
        });    
    },[])
    //console.log(peerList);
    return(
        <div>
             {
                  Object.keys(peerList).map((key,index) => (
                      <div key={index}>
                          {peerList[key].from}
                      </div>
                  ))
              }                      
        </div>
    )
}