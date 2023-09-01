import { useRef } from "react";
import LocalStreamManager from "../common/LocslStreamManager";
import Peer from "../common/Peer";
import "./TestWebRTC.css";
import config from "../common/WebRTC-Config";
export default function TestWebRTC() {
    let callee = new Peer();
    let caller = new Peer();

    let calleeStatus = useRef<HTMLTextAreaElement | null>(null);
    let callerStatus = useRef<HTMLTextAreaElement | null>(null);
    let calleeMedia = useRef<HTMLVideoElement | null>(null);
    let callerMedia = useRef<HTMLVideoElement | null>(null);
    let localStream:(MediaStream|null);
    let shareMediaAudio=false;
    let shareMediaVideo=false;
    callee.setConfig(config);
    callee.on("connectionStateChange", (status: string) => {
        if (calleeStatus.current) {
            calleeStatus.current.value += status + "\n";
        }
    });
    callee.on("signal", (signaleObj: any) => {
        if (calleeStatus.current) {
            calleeStatus.current.value += signaleObj.type + "\n";
        }
        caller.signal(signaleObj);
    });
    callee.on("stream",(stream:MediaStream)=>{
        if (calleeMedia.current){
            calleeMedia.current.srcObject=stream;
        }        
    })
    caller.setConfig(config);
    caller.on("connectionStateChange", (status: string) => {
        if (callerStatus.current) {
            callerStatus.current.value += status + "\n";
        }
    });
    caller.on("signal", (signaleObj: any) => {
        if (callerStatus.current) {
            callerStatus.current.value += signaleObj.type + "\n";
        }
        callee.signal(signaleObj);
    });
    callee.init();
    caller.init();

    let call = () => {
        caller.call();
    }
    let hangUp = () => {
        if (localStream){
            LocalStreamManager.closeStream(localStream);
        }
        caller.hangUp();
    }
    let manageStream=async()=>{
        if (shareMediaAudio || shareMediaVideo) {
            localStream = await LocalStreamManager.getMediaStream(shareMediaVideo,shareMediaAudio);
            if (localStream){
                caller.setStream(localStream);
                if (callerMedia.current){
                    callerMedia.current.srcObject=localStream;
                }
            }
        }else{
            if (localStream){
                LocalStreamManager.closeStream(localStream);
            }
        }
    }
    let shareAudio=async(event:React.MouseEvent)=>{
        shareMediaAudio=(event.target as HTMLInputElement).checked;
        await manageStream();
    }
    let shareVideo=async (event:React.MouseEvent)=>{
        shareMediaVideo=(event.target as HTMLInputElement).checked;
        await manageStream();  
    }
    return (
        <div className="container">
            <div className="row">
                <div className="cell">Caller</div>
                <div className="cell end">Callee</div>
            </div>
            <div className="videoRow">
                <div className="videoCell">
                    <video autoPlay controls muted ref={callerMedia}></video>
                </div>
                <div className="videoCell end">
                    <video autoPlay controls muted ref={calleeMedia}></video>
                </div>
            </div>
            <div className="panelRow">
                <div className="panelCell">
                    <div className="panel">
                        <div><input onClick={shareAudio} type="checkbox" />Share Audio</div>
                        <div><input onClick={shareVideo} type="checkbox" />Share Video</div>
                        <button onClick={call}>Create Offer</button>
                        <button onClick={hangUp}>Hang Up</button>
                    </div>
                    <div className="panel">
                        Offer:
                    </div>
                    <div className="panel">
                        <textarea id="offer" readOnly></textarea>
                    </div>
                    <div className="panel">
                        &nbsp;<button>Copy offer</button>
                    </div>
                    <div className="panel">
                        Callee answer:
                    </div>
                    <div className="panel">
                        <textarea id="calleeAnswer"></textarea>
                    </div>
                    <div className="panel">
                        &nbsp;<button>Process Callee Answer</button>
                    </div>
                </div>
                <div className="panelCell end">
                    <div className="panel">
                        <div>Caller Offer:</div>
                    </div>
                    <div className="panel">
                        <textarea id="callerOffer"></textarea>
                    </div>
                    <div className="panel">
                        <button >Process Caller offer</button>
                    </div>
                    <div className="panel">
                        Answer:
                    </div>
                    <div className="panel">
                        <textarea id="answer" readOnly></textarea>
                    </div>
                    <div className="panel">
                        <button>Copy answer</button>
                    </div>
                </div>
            </div>
            <div className="statusRow">
                <div className="bottom cell">
                    <textarea ref={callerStatus}></textarea>
                </div>
                <div className="bottom cell end">
                    <textarea ref={calleeStatus}></textarea>
                </div>
            </div>
        </div>
    )
}