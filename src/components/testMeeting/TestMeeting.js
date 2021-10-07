import { useEffect, useReducer } from "react";
import io from "socket.io-client";
import Peer from "./Peer";
export default function TestMeeting0() {
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
                let peer=new Peer();
                peer.name=action.peer.name;
                peer.socket=action.socket;
                peer.remoteSocketId=action.peer.socketId;
                peer.askConnect();
                let peerList = { ...state.peerList };
                //console.log(state.peerList);
                peerList[action.peer.socketId] = peer;

                result = { ...state, "peerList": peerList };
                break;
            case "initialPeerList":
                let initialPeerList={};
                Object.keys(action.peerList).forEach(socketId=>{
                    let peer=new Peer();
                    peer.name=action.peerList[socketId].name;
                    peer.socket=action.socket;
                    peer.remoteSocketId=socketId;
                    initialPeerList[socketId]=peer;
                })
                result = { ...state, peerList: initialPeerList }
                break;
            case "removePeer":
                let temp1 = { ...state.peerList };
                delete temp1[action.socketId]
                result = result = { ...state, peerList: temp1 }
                break;
            case 'requestConnect':
                let remotePeer=state.peerList[action.remoteSocketId];
                console.log("Receive connect request event:"+action.remoteSocketId);
                console.log("==================peer list===============");
                console.log(state.peerList);
                if (remotePeer){
                    console.log("Receive connect request:"+remotePeer.name);
                }
                result = state;
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
            dispatch({ type: "initialPeerList", peerList: response.peerList,"socket":socket })
        });
        socket.on("newPeer", (peer) => {
            dispatch({ type: "addPeer", peer: peer,"socket":socket })
        });
        socket.on("removePeer", (socketId) => {
            dispatch({ type: "removePeer", socketId: socketId })
        });
        socket.on("requestConnect",(remoteSocketId)=>{
            dispatch({type:'requestConnect',remoteSocketId:remoteSocketId});
        })
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