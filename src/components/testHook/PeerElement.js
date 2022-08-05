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
        <div className="border border-dark d-flex flex-row m-1 p-1 rounded-3">
            <div className="m-0 peer p-0 flex-grow-1">
                <video autoPlay muted className="video" controls ref={media} />
            </div>
            <div className="flex-grow-1">
                Peer Name:{peer.peerName}<br />
                Status:{peerConnectionState}
            </div>
        </div>
    )
}