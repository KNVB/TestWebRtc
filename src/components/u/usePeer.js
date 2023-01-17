import { useReducer } from "react";
let reducer = (state, action) => {
    let result = { ...state };
    switch (action.type) {
        case "updatePeerConnectionState":
            result.connectionState=action.connectionState;
            break
        case "updateRemoteStream":
            result.remoteStream=action.remoteStream;
            break;
        default:
            break
    }
    return result
}
export function usePeer(peer) {
    const [itemList, updateItemList] = useReducer(reducer, {
        connectionState:'',
        peer: peer,
        peerName: peer.peerName,
        remoteStream: null
    });
    peer.on("connectionStateChange", connectionState => {
        console.log(peer.peerName + "," + peer.getConnectionState() + "," + connectionState);
        updateItemList({ "connectionState": connectionState, type: "updatePeerConnectionState" });
    });
    peer.on("stream", stream => {
        console.log("Received stream event from:" + itemList.peerName);
        updateItemList({ "remoteStream": stream, type: "updateRemoteStream" });
    });
    return [
        itemList.connectionState,
        itemList.peerName,
        itemList.remoteStream
    ]
}