import './PeerElement.css';
import { useEffect, useRef } from "react";
import Peer from './Peer';
export default function PeerElement({peerInfo,socket}) {
    let media = useRef();
    useEffect(() => {
        console.log(peerInfo);
        let peer=new Peer(peerInfo.name,peerInfo.socketId);
        peer.on("signal",signalData=>{
            
        })
    }, []);


    return (
        <div className="border border-info d-flex flex-row flex-grow-1 peer">
            <div className="w-50">
                <video autoPlay muted controls ref={media} />
            </div>
            <div className="w-50">
                {peerInfo.name}
            </div>
        </div>
    )
};
