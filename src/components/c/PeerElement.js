import {useState} from "react";
export default function PeerElement({peer}){
    const [connectionState,updateConnectionState]=useState("N.A.");
    
    if (!peer.isLocalPeer){
        peer.on("connectionStateChange",peerConnectionState=>{
            console.log(peer.isLocalPeer,peer.peerName,peerConnectionState);
            updateConnectionState(peerConnectionState);
        });
    }
    
    return (
        <div className="border border-dark m-1 p-1 rounded-3">
            Peer Name:{peer.peerName}<br/>
            Status:{connectionState}
        </div>
    )
}