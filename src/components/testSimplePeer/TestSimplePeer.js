import { useState } from "react";
import Panel from "../share/panel/Panel";
export default function TestSimplePeer() {
    let [connectionState,setConnectionState]= useState("Close");
    let [isShareAudio,updateShareAudio]=useState(false);
    let [isShareVideo,updateShareVideo]=useState(false);
    let call = () => {
        console.log("Make A Call");
    };
    let hangUp = () => {
        console.log("Hang Up");
    };
    let updateConnectionStatus=()=>{
        setConnectionState("Open");
    }
    let setShareAudio = (value) => {
        console.log("setShareAudio=" + value);
    };
    let setShareVideo = (value) => {
        console.log("setShareVideo=" + value);
    };
    let controls = { call, hangUp, setShareAudio, setShareVideo };
    return(
        <Panel controls={controls} connectionState={connectionState}/>
    );  
}
