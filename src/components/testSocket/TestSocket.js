import { useEffect, useReducer } from "react";
import io from "socket.io-client";
export default function TestSocket() {
    let reducer = (state, action) => {
        let result = { ...state };
        switch (action.type) {
            case "newPeer":
                result.peerInfoList[action.newPeer.peerId] = {
                    call: true,
                    name: action.newPeer.name,
                    socketId: action.newPeer.socketId,
                };
                break;
            case "removePeer":
                action.peerIdList.forEach(peerId=>{
                    delete result.peerInfoList[peerId];
                })                
                break;
            case "setPeerList":
                let temp = {};
                Object.keys(action.peerInfoList).forEach((key) => {
                    let peerInfo = action.peerInfoList[key];
                    temp[key] = {
                        call: false,
                        name: peerInfo.name,
                    };
                });
                result.peerInfoList = temp;
                break;
            default:
                break;
        }
        return result;
    };
    useEffect(() => {
        let peerId=null;
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
        let socket = io(process.env.REACT_APP_SOCKET_URL + "b", {
            transports: ["websocket"],
        });
        socket.on("connect", () => {
            const engine = socket.io.engine;
            
            let lastDisCntReason = "";
            //console.log(engine.transport.name);
            console.log("Connect to server established.");
            if (peerId === null){
                socket.emit("hi", peerName, response => {
                    peerId=response.peerId;
                    setItem({ type: "setPeerList", peerInfoList: response.peerList });
                });
            }
            socket.on("disconnect", reason => {
                console.log("socket disconnect event occur:" + reason);                
            });
            socket.on("newPeer", newPeer => {
                setItem({ type: "newPeer", newPeer: newPeer });
            });
          
            engine.on("reconnect", () => {
                console.log("Reconnect successed.");
                socket.emit("refreshSocketId",peerId);                
            });
            socket.on("disconnectedPeerIdList", peerIdList => {
                setItem({ type: "removePeer", peerIdList: peerIdList });
            });

            engine.on("close", reason => {
                // called when the underlying connection is closed
                console.log("Engine Close event occured:" + reason);
                lastDisCntReason = reason;
            });
        });
        return () => {socket.close()}
    }, []);
    let peerElementList = [];
    const [items, setItem] = useReducer(reducer, { peerInfoList: {} });
    if (items.peerInfoList) {
        Object.keys(items.peerInfoList).forEach((peerId) => {
            peerElementList.push(<div key={peerId}>{items.peerInfoList[peerId].name}</div>);
        });
    }
    return (
        <>
            {peerElementList}
        </>
    )
}