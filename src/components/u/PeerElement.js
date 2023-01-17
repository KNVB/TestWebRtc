import { useEffect, useRef } from "react";
import { usePeer } from "./usePeer";
import './PeerElement.css';
export default function PeerElement({ peer }) {
    const [connectionState, peerName, remoteStream] = usePeer(peer);
    let media = useRef();
    useEffect(() => {
        media.current.srcObject = remoteStream;
    }, [remoteStream])
    useEffect(()=>{
        media.current.onabort = function() {
            console.log("Video load aborted");
        };
        media.current.onerror = function() {
            alert("Error! Something went wrong");
        };
        media.current.onwaiting = function() {
            alert("Wait! I need to buffer the next frame");
        };
        media.current.onstalled = function() {
            console.log("Media data is not available");
        };
        media.current.onwaiting = (event) => {
            console.log('Video is waiting for more data.');
        };
    },[])
    
    return (
        <div className="d-flex flex-row border border-info m-0 p-0 peer rounded-3 w-100">
            <div className="border border-dark m-1 p-0 rounded-3 peer-cell">
                <video autoPlay muted controls className='h-100 w-100 position-absolute rounded-3 video' ref={media} />
            </div>
            <div className="border border-dark m-1 p-1 rounded-3 peer-cell text-break">
                Peer Name:<br />
                {peerName}<br />
                Status:<br />
                {connectionState}
            </div>
        </div>
    )
}