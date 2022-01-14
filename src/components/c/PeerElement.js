import {useEffect,useState} from "react";
export default function PeerElement({peer}){
    const[peerConnectionState,setPeerConnectionState]=useState("N.A.");
    useEffect(()=>{
        peer.on("connectionStateChange",connectionState=>{
            console.log(peer.getConnectionState());
            setPeerConnectionState(connectionState);
        });
    },[])
    
    return (
        <div className="border border-dark m-1 p-1 rounded-3">
            Peer Name:{peer.peerName}<br/>
            Status:{peerConnectionState}
        </div>
    )
}