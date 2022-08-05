import { useEffect, useRef, useState } from "react";
import './PeerElement.css';
export default function PeerElement({ peer }) {
    let media = useRef();
    const [peerConnectionState, setPeerConnectionState] = useState("N.A.");
    useEffect(() => {
        peer.on("connectionStateChange", connectionState => {
            console.log(peer.peerName + "," + peer.getConnectionState() + "," + connectionState);
            setPeerConnectionState(connectionState);
        });
        peer.on("stream", stream => {
            console.log("Received stream event from:" + peer.peerName);
            media.current.srcObject = stream;
        });
    }, [peer]);
    return (
        <div className="border border-info d-flex flex-grow-1 flex-row m-0 p-0 rounded-3">
            <div className="border border-dark m-1 p-0 rounded-3 position-relative w-50">
                <video autoPlay muted controls className='h-100 w-100 position-absolute rounded-3 video' ref={media}/>
            </div>
            <div className="border border-dark m-1 p-1 rounded-3 w-50">
                Peer Name:{peer.peerName}<br />
                Status:{peerConnectionState}
            </div>
        </div>
    )
}