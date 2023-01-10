import { useReducer } from "react";
let obj = {
    connectionState: "",
    dataChannelMessage: "",
    dataChannelState: "",
    eventType: "",
    icecandidate: null,
    iceConnectionState: "",
    iceGatheringState: "",
    localStream: null,
    peerConnection: null,
    signalingState: '',
    remoteStream: null
}
let reducer = (state, action) => {
    let result = { ...state };
    let temp;
    //console.log(action);
    switch (action.type) {
        case "dataChannelClose":
            result.eventType = "dataChannelStateChange";
            result.dataChannelState = "Data Channel closed";
            break;
        case "dataChannelError":
            result.eventType = "dataChannelStateChange";
            result.dataChannelState = action.event;
            break;
        case "dataChannelOpen":
            result.eventType = "dataChannelStateChange";
            result.dataChannelState = "Data Channel opened";
            break;
        case "dataMessage":
            result.eventType = "dataMessage";
            result.dataChannelMessage = action.message;
            break;
        case "iceCandidate":
            result.eventType = "iceCandidate";
            result.iceCandidate = action.iceCandidate;
            break;
        case "initPeerConnection":
            result.peerConnection = action.peerConnection;
            break;
        case "negotiation":
            result.eventType = "negotiation";
            break;
        case "remoteStream":
            result.eventType = "remoteStream";
            result.remoteStream = action.remoteStream;
            break;
        case "setLocalStream":
            result.localStream = action.localStream;
            if (result.peerConnection) {
                let senders = result.peerConnection.getSenders();
                senders.forEach(sender => {
                    result.peerConnection.removeTrack(sender);
                })
                if (action.localStream) {
                    for (const track of action.localStream.getTracks()) {
                        result.peerConnection.addTrack(track, action.localStream);
                    }
                }
            }
            break;
        case "updateConnectionState":
            result.eventType = "stateChange";
            result.connectionState = action.state;
            break;
        case "updateICEConnectionState":
            result.eventType = "stateChange";
            result.iceConnectionState = action.state;
            break;
        case "updateICEGatheringState":
            result.eventType = "stateChange";
            result.iceGatheringState = action.state;
            break;
        default:
            break;
    }
    return result;
}
export function useWebRTC() {
    const [itemList, updateItemList] = useReducer(reducer, obj);

    let call = () => {
        let dataChannel = itemList.peerConnection.createDataChannel("chat");

        dataChannel.onclose = () => {
            updateItemList({ type: "dataChannelClose" });
        };
        dataChannel.onerror = (event) => {
            updateItemList({ event: event, type: "dataChannelError" });
        };
        dataChannel.onmessage = (message) => {
            updateItemList({ message: message, "type": "dataMessage" });
        };
        dataChannel.onopen = () => {
            updateItemList({ type: "dataChannelOpen" });
        };
    }
    let init = configuration => {
        let peerConnection = new RTCPeerConnection(configuration);
        peerConnection.ondatachannel = (event) => {
            updateItemList({ dataChannel: event.channel, type: "initDataChannel" });
        }
        peerConnection.onconnectionstatechange = () => {
            updateItemList({ state: peerConnection.connectionState, "type": "updateConnectionState" });
        }
        peerConnection.onicecandidate = (event) => {
            updateItemList({ "iceCandidate": event.candidate, "type": "iceCandidate" })
        }
        peerConnection.onicecandidateerror = event => {
            updateItemList({ event: event, type: "iceCandidateError" });
        }
        peerConnection.oniceconnectionstatechange = () => {
            updateItemList({ state: peerConnection.iceConnectionState, "type": "updateICEConnectionState" });
        };
        peerConnection.onicegatheringstatechange = () => {
            updateItemList({ state: peerConnection.iceGatheringState, "type": "updateICEGatheringState" });
        };
        peerConnection.onnegotiationneeded = () => {
            updateItemList({ "type": "negotiation" });
        }
        peerConnection.ontrack = event => {
            updateItemList({ remoteStream: event.streams[0], "type": "remoteStream" });
        };
        updateItemList({ "peerConnection": peerConnection, "type": "initPeerConnection" });
    }
    let getLocalDescription = () => {
        return itemList.peerConnection.localDescription;
    }
    let hangUp = () => {
        if (itemList.peerConnection && (itemList.peerConnection.signalingState !== "closed")) {
            itemList.peerConnection.getSenders().forEach(sender => {
                itemList.peerConnection.removeTrack(sender);
            });
            itemList.peerConnection.close();
        }
    }

    let setLocalDescription = async () => {
        await itemList.peerConnection.setLocalDescription();
    }
    let setLocalStream = stream => {
        updateItemList({ "localStream": stream, type: "setLocalStream" })
    }
    let setRemoteDescription = async (remoteDescription) => {
        await itemList.peerConnection.setRemoteDescription(remoteDescription);
    }
    return [
        itemList.connectionState,
        itemList.dataChannelMessage,
        itemList.dataChannelState,
        itemList.eventType,
        itemList.iceCandidate,
        itemList.iceConnectionState,
        itemList.iceGatheringState,
        itemList.signalingState,
        itemList.remoteStream,
        {
            call,
            init,
            getLocalDescription,
            hangUp,
            setLocalDescription,
            setLocalStream,
            setRemoteDescription
        }
    ]
}