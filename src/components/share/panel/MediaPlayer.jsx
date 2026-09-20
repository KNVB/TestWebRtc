import {forwardRef,useImperativeHandle,useRef} from "react";
import "./MediaPlayer.css";
const MediaPlayer=forwardRef((props,ref)=>{
    const media = useRef();
    useImperativeHandle(ref, () => ({
        getStream:()=>{
            return  media.current.srcObject;
        },
        setStream:(stream)=>{
            media.current.srcObject=stream;
        },
        stop:()=>{
            media.current.pause();
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