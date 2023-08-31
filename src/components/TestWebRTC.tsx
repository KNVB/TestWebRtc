import { useEffect, useReducer, useRef } from "react";
import Peer from "../common/Peer";
import "./TestWebRTC.css";
import config from "../common/WebRTC-Config";

interface AppState {
    answer: (undefined | RTCSessionDescription);
    callee: (undefined | Peer);
    caller: (undefined | Peer);
    isReady: boolean;
    updateItemList: any;
    offer: (undefined | RTCSessionDescription);
}
type AppActions = {
    type: string;
    data: any;
}
let appReducer = (state: AppState, action: AppActions): AppState => {
    let result = { ...state };
    switch (action.type) {
        case "init":
            let caller = new Peer();
            let callee = new Peer();
            caller.setConfig(config);
            caller.init();

            callee.setConfig(config);
            callee.init();
            result.callee = callee;
            result.caller = caller;
            result.isReady = true;
            break
        case "call":
            if (result.caller) {
                result.caller.on("signal", (signalObj: any) => {
                    switch (signalObj.type) {
                        case "remoteDescription":
                            action.data.value = JSON.stringify(signalObj.value);
                            break;
                        default:
                            break;
                    }
                });
                result.caller.call();
            }
            break;
        case "updateOffer":
            result.offer = action.data;
            break;
        default:
            break;
    }
    return result;
}

export default function TestWebRTC() {
    const [itemList, updateItemList] = useReducer(appReducer, {
        answer: undefined,
        callee: undefined,
        caller: undefined,
        updateItemList: undefined,
        isReady: false,
        offer: undefined,
    });
    let offerRef = useRef(null);
    useEffect(() => {
        updateItemList({ type: "init", data: undefined })
    }, []);
    let call = () => {
        if (itemList.caller) {
            updateItemList({ type: "call", data: offerRef.current })
        }
    }
    return (
        <div className="container">
            {itemList.isReady &&
                <div>
                    <button onClick={call}>Call</button>
                    <textarea readOnly={true} ref={offerRef}></textarea>
                </div>
            }
        </div>
    )
}