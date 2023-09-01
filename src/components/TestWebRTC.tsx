import { useRef } from "react";
import Peer from "../common/Peer";
import "./TestWebRTC.css";
import config from "../common/WebRTC-Config";
export default function TestWebRTC() {
    let calleeStatus = useRef<HTMLTextAreaElement | null>(null);
    let callerStatus = useRef<HTMLTextAreaElement | null>(null);
    let callee = new Peer();
    let caller = new Peer();

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
    return (
        <div className="container">
            <div className="row">
                <div className="cell">Caller</div>
                <div className="cell end">Callee</div>
            </div>
            <div className="videoRow">
                <div className="videoCell">
                    <video autoPlay controls muted id="callerMedia"></video>
                </div>
                <div className="videoCell end">
                    <video autoPlay controls muted id="calleeMedia"></video>
                </div>
            </div>
            <div className="panelRow">
                <div className="panelCell">
                    <div className="panel">
                        <div><input type="checkbox" />Share Audio</div>
                        <div><input type="checkbox" />Share Video</div>
                        <button>Create Offer</button>
                        <button>Hang Up</button>
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
                    <textarea></textarea>
                </div>
                <div className="bottom cell end">
                    <textarea></textarea>
                </div>
            </div>
            {/*
            <div className="row">
                <textarea ref={callerStatus}></textarea>
                <textarea ref={calleeStatus}></textarea>
                <button onClick={call}>Call</button>
            </div>
            */}
        </div>
    )
}