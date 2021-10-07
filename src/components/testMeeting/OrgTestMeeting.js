import { useEffect, useReducer } from "react";
import io from "socket.io-client";
export default function OrgTestMeeting() {
    let peerName;
    let sUsrAg = navigator.userAgent;
    if (sUsrAg.indexOf("Edg") > -1) {
        peerName = "Edge";
    } else {
        if (sUsrAg.indexOf("Chrome") > -1) {
            peerName = "Chrome";
        } else {
            if (sUsrAg.indexOf("Firefox") > -1) {
                peerName = "Firefox";
            } else {
                if (sUsrAg.indexOf("Safari") > -1) {
                    peerName = "Safari";
                }
            }
        }
    }
    let socket = io.connect(process.env.REACT_APP_SOCKET_URL + "testMeeting", {
        transports: ["websocket"],
    })
    const initialState = {
        peerList: {}
    };
    let reducer = (state, action) => {
        let result = null;
        switch (action.type) {
            case "addPeer":
                let temp = { ...state.peerList };
                //console.log(state.peerList);
                temp[action.peer.socketId] = action.peer;
                result = result = { ...state, peerList: temp }
                break;
            case "initialPeerList":
                result = { ...state, peerList: action.peerList }
                break;
            case "removePeer":
                let temp1 = { ...state.peerList };
                delete temp1[action.socketId]
                result = result = { ...state, peerList: temp1 }
                break;
            default:
                result = state;
                break
        }
        return result;
    }
    useEffect(() => {
        socket.emit("hi", peerName, (response) => {
            console.log("=======================hi===============");
            dispatch({ type: "initialPeerList", peerList: response.peerList })
        });
        socket.on("newPeer", (peer) => {
            dispatch({ type: "addPeer", peer: peer })
        });
        socket.on("removePeer", (socketId) => {
            dispatch({ type: "removePeer", socketId: socketId })
        });
    }, []);
    const [state, dispatch] = useReducer(reducer, initialState);
    return (
        <>
            {Object.keys(state.peerList).map((key, index) => (
                <div key={index}>{state.peerList[key].name}</div>
            ))}
        </>
    )
}