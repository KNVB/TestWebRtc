import {useEffect,useState} from "react";
export default function PeerElement({peer}){
    const[peerConnectionState,setPeerConnectionState]=useState();    
    useEffect(()=>{
        peer.on("connectionStateChange",connectionState=>{
            console.log(peer.peerName+","+peer.getConnectionState()+","+connectionState);
            setPeerConnectionState(connectionState);
        });
        setPeerConnectionState("N.A.");
    },[peer]);
    return (
        <div className="border border-dark m-1 p-1 rounded-3">
            Peer Name:{peer.peerName}<br/>
            Status:{peerConnectionState}
        </div>
    )
}