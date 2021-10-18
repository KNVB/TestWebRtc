import { forwardRef, useImperativeHandle, useRef } from "react";
import './Peer.css';
const Peer = forwardRef(({peerObj}, ref) => {
    let media=useRef();
    useImperativeHandle(ref, () => ({
        setStream:(stream)=>{media.current.srcObject=stream;}
    }));
    return (
        <div className="border border-info d-flex flex-row flex-grow-1 peer" key={peerObj.socketId}>
            <div className="w-50">
                <video autoPlay muted controls ref={media}/>
            </div>
            <div className="w-50">
                {peerObj.name}
            </div>
        </div>
    )
});
export default Peer;