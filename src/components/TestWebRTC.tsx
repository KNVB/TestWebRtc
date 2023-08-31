import { useRef } from "react";
import Peer from "../common/Peer";
import "./TestWebRTC.css";
import config from "../common/WebRTC-Config";
export default function TestWebRTC() {
    let calleeStatus=useRef<HTMLTextAreaElement | null>(null);
    let callerStatus=useRef<HTMLTextAreaElement | null>(null);
    let callee=new Peer();
    let caller=new Peer();
    
    callee.setConfig(config);
    callee.on("connectionStateChange",(status:string)=>{
        if (calleeStatus.current){
            calleeStatus.current.value+=status+"\n";
        }
    });
    callee.on("signal",(signaleObj:any)=>{
        if (calleeStatus.current){
            calleeStatus.current.value+=signaleObj.type+"\n";
        }
        caller.signal(signaleObj);    
    });
    caller.setConfig(config);
    caller.on("connectionStateChange",(status:string)=>{
        if (callerStatus.current){
            callerStatus.current.value+=status+"\n";
        }
    });
    caller.on("signal",(signaleObj:any)=>{
        if (callerStatus.current){
            callerStatus.current.value+=signaleObj.type+"\n";
        }
        callee.signal(signaleObj);    
    });
    callee.init();
    caller.init();
    let call=()=>{
        caller.call();
    }
    return(
        <div className="container">
            <div className="row">
                <textarea ref={callerStatus}></textarea>
                <textarea ref={calleeStatus}></textarea>
                <button onClick={call}>Call</button>
            </div>
        </div>
    )
}