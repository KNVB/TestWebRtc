import {forwardRef,useImperativeHandle,useRef,useState} from "react";
import "./MediaPlayer.css";
const MediaPlayer=forwardRef((props,ref)=>{
    const media = useRef();
    useImperativeHandle(ref, () => ({
        setStream:(stream)=>{
            media.current.srcObject=stream;
        }
    }));
    return(
        <video 
            autoPlay={true}
            className="MediaPlayer"
            controls
            ref={media}
            muted/>
    )
});
export default MediaPlayer;