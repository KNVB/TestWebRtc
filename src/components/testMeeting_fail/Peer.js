import { useRef } from "react";
import './Peer.css';
export default function Peer({peerObj}) {
    let media=useRef();
    console.log("Peer name:"+JSON.stringify(peerObj));    
    return (
        <div className="border border-info d-flex flex-row flex-grow-1 peer" key={peerObj.socketId}>
            <div className="w-50">
                <video autoPlay ref={media} id={peerObj.socketId}/>
            </div>
            <div className="w-50">
                {peerObj.name}
            </div>
        </div>
    )
}
