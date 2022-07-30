import { useEffect,useRef } from "react";
import Draggable from "react-draggable";
import './LocalMedia.css';
export default function LocalMedia({ localStream }) {
    const nodeRef = useRef(),media = useRef();
    useEffect(()=>{
        media.current.srcObject=localStream;
    },[localStream])
    return (
        <Draggable nodeRef={nodeRef}>
            <div
                className="btn btn-dark position-absolute localMedia m-3 p-0 rounded-3"
                ref={nodeRef}>
                <video
                    autoPlay={true}
                    className="rounded-3"
                    muted
                    ref={media} />
            </div>
        </Draggable>
    )
}