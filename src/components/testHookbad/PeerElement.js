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
            console.log("Received stream event from:" + peer.getPeerName());
            media.current.srcObject = stream;
        });
    }, [peer]);
    return (
        <div className="border border-dark m-1 p-1 rounded-3">
            <div className="w-50">
                <video autoPlay muted controls ref={media} />
            </div>
            <div>
                Peer Name:{peer.getPeerName()}<br />
                Status:{peerConnectionState}
            </div>
        </div>
    )
}