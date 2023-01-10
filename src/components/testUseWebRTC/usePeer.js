import { useWebRTC } from "./useWebRTC";
import { useEffect, useReducer } from "react";
let obj = {
    ignoreOffer: false,
    isDebug: false,
    makingOffer: false,
    polite: false
}
let reducer = (state, action) => {
    let result = { ...state };
    let temp;
    console.log(action);
    switch (action.type) {
        case "call":
            result.polite = true;
            break;
        case "setMakeOffer":
            result.makingOffer = action.value;
            break;
        default:
            break;
    }
    return result;
}
export function usePeer() {
    let [
        connectionState,
        dataChannelMessage,
        dataChannelState,
        eventType,
        iceCandidate,
        iceConnectionState,
        iceGatheringState,
        signalingState,
        remoteStream,
        action
    ] = useWebRTC();
    //console.log(useWebRTC());
    const [itemList, updateItemList] = useReducer(reducer, obj);
    let call = () => {
        updateItemList({ "type": "call" });
        action.call();
    }
    let init = () => {
        action.init();
    }
    let negotiate = async () => {
        updateItemList({ "type": "setMakeOffer", value: true });
        await action.setLocalDescription();
        let localDescription = action.getLocalDescription();
        updateItemList({ "type": "setMakeOffer", value: false });
    }
    let printState = () => {
        console.log("=======================================================");
        console.log("connectionState:" + connectionState);
        console.log("dataChannelState:" + dataChannelState);
        console.log("iceConnectionState:" + iceConnectionState);
        console.log("iceGatheringState:" + iceGatheringState);
        console.log("signalingState:" + signalingState);
        console.log("=======================================================");
    }
    useEffect(() => {
        console.log(eventType);
        switch (eventType) {
            case "negotiation":
                negotiate();
                break;
            case "stateChange":
                printState();
                break;
            default:
                break
        }
    }, [eventType])
    return [{
        call,
        hangUp: action.hangUp,
        init
    }]
}