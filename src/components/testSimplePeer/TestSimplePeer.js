import { useRef, useState } from "react";
import Panel from "../share/panel/Panel";
import SignalServer from "./SignalServer";
export default function TestSimplePeer() {
    let [connectionState,setConnectionState]= useState("Close");
    const panel=useRef();
    let signalServer=new SignalServer();
    let call = () => {
        console.log("Make A Call");
    };
    let hangUp = () => {
        console.log("Hang Up");
    };
    /*
    let updateConnectionStatus=()=>{
        setConnectionState("Open");
    }*/
    let updateLocalStream=(stream)=>{
        //console.log("Update Local Stream="+stream);
        panel.current.addMsg("Local Stream Updated="+stream);
    }
    let controls = { call, hangUp, updateLocalStream };
    return(
        <Panel
            connectionState={connectionState} 
            controls={controls}
            ref={panel}/>
    );  
}
