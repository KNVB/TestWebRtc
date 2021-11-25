import { useEffect, useReducer } from "react";
import io from "socket.io-client";
import Peer from './Peer';
export default function TestSocket() {
    let reducer = (state, action) => {
        let result = { ...state };
        switch (action.type) {
            case "disconnect":
                result.socket.disconnect();
                break
            case "newPeer":
                let peer =new Peer(action.newPeer.name);
                peer.isCall=true;
                result.peerInfoList[action.newPeer.peerId] = peer;
                break;
            case "peerReconnect":
                console.log("Peer " + result.peerInfoList[action.peerId].name + " Reconnect");
                break;
            case "removePeer":
                action.peerIdList.forEach(peerId => {
                    delete result.peerInfoList[peerId];
                })
                break;
            case "setPeerList":
                let temp = {};
                Object.keys(action.peerInfoList).forEach((key) => {
                    let peerInfo = action.peerInfoList[key];
                    let peer =new Peer(peerInfo.name);
                    peer.isCall=false;
                    temp[key] = peer;
                });
                result.peerInfoList = temp;
                break;
            case "setSocket":
                result.socket=action.socket;
                break;
            default:
                break;
        }
        return result;
    };
    useEffect(() => {
        let peerId = null;
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
            //console.log(engine.transport.name);
            console.log("Connect to server established.");
            if (peerId === null) {
                socket.emit("hi", peerName, response => {
                    peerId = response.peerId;
                    setItem({ type: "setPeerList", peerInfoList: response.peerList });
                });
            }
            setItem({type:"setSocket","socket":socket});
            socket.on("disconnect", reason => {
                console.log("socket disconnect event occur:" + reason);
            });
            socket.on("removePeerIdList", peerIdList => {
                setItem({ type: "removePeer", peerIdList: peerIdList });
            });
            socket.on("newPeer", newPeer => {
                setItem({ type: "newPeer", newPeer: newPeer });
            });

            socket.io.on("reconnect", () => {
                console.log("Reconnect successed.");
                socket.emit("refreshSocketId", peerId,response=>{
                    if (response.result === false){
                        alert(response.message);
                    }
                });
            });
            socket.on("peerReconnect", peerId => {
                //console.log("Peer Reconnect:"+peerId);
                //console.log("Peer " + items.peerInfoList[peerId].name + " Reconnect");
                setItem({type:"peerReconnect","peerId": peerId});
            });


            engine.on("close", reason => {
                // called when the underlying connection is closed
                console.log("Engine Close event occured:" + reason);
                //lastDisCntReason = reason;
            });
        });
        return () => { socket.disconnect() }
    }, []);    
    let peerElementList = [];
    const [items, setItem] = useReducer(reducer, { peerInfoList: {},socket:null});
    let disconnect=()=>{
        setItem({type:"disconnect"});
    }
    if (items.peerInfoList) {
        Object.keys(items.peerInfoList).forEach((peerId) => {
            peerElementList.push(<div key={peerId}>{items.peerInfoList[peerId].name}</div>);
        });
    }
    return (
        <>
            {peerElementList}
            <button onClick={disconnect}>Disconnect</button>
        </>
    )
}