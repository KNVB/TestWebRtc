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
        <div className="d-flex flex-row border border-info m-0 p-0 peer rounded-3 w-100">
            <div className="border border-dark m-1 p-0 rounded-3 flex-grow-1 position-relative peer-videoCell">
                <video autoPlay muted controls className='h-100 w-100 position-absolute rounded-3 video' ref={media} />
            </div>
            <div className="border border-dark m-1 p-1 rounded-3 flex-grow-1 peer-nameCell text-break">
                Peer Name:<br />
                {peer.peerName}<br />
                Status:<br />
                {peerConnectionState}
            </div>
        </div>
    )
}