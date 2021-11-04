import { useEffect, useReducer } from "react";
import io from "socket.io-client";
import LocalStreamManager from "../../util/LocalStreamManager";
import Peer from './Peer';
import PeerElement from "./PeerElement";
export default function TestSocket(){
    let localStreamManager = new LocalStreamManager();
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
    useEffect(() => {
        let socket = io(process.env.REACT_APP_SOCKET_URL + "a", {
          transports: ["websocket"],
        });
        setItem({ type: "init", peerList: {}, socket: socket });
        socket.emit("hi", peerName, (response) => {
          //console.log(response.peerList);
          setItem({ type: "setPeerList", peerList: response.peerList });
        });
        
        socket.on("newPeer", (newPeer) => {
          setItem({ type: "newPeer", newPeer: newPeer });
        });
        socket.on("removePeer", (socketId) => {
          setItem({ type: "removePeer", socketId: socketId });
        });
      }, [peerName]);
    let reducer = (state, action) => {      
        let result = { ...state };
        switch (action.type) {
            case "init":
                result.peerList = action.peerList;
                result.socket = action.socket;
                break;
            case "newPeer":
                let peer=new Peer(action.newPeer.name,action.newPeer.socketId);
                peer.isCall=true;
                result.peerList[action.newPeer.socketId]=peer; 
                break;
            case "removePeer":
                if (result.peerList[action.socketId]){
                  result.peerList[action.socketId].hangUp();
                }
                delete result.peerList[action.socketId];
                break;
            case "setPeerList":
                Object.keys(action.peerList).forEach(socketId=>{
                    let peer=new Peer(action.peerList[socketId].name,socketId);
                    result.peerList[socketId]=peer;    
                })
                break;
            default:
                break;
        }
        return result;
    }
    let go = async () => {
        let localStream;
        try {
            localStream = await localStreamManager.getMediaStream(true, false);
        } catch (error) {
            console.log("Getting local media failure:" + error.message);
            localStream = null;
        } finally {
            //meeting.setLocalStream(localStream);
            //peerList.current.setLocalStream(meeting.getLocalSocketId(),localStream);
            Object.keys(items.peerList).forEach(socketId=>{
                if (socketId !== items.socket.id){
                  items.peerList[socketId].setStream(localStream);
                }else {
                  items.peerList[socketId].stream(localStream);
                }
            })
        }
    };
    const [items, setItem] = useReducer(reducer, {});
    let peerElementList = [];
    //console.log(items.peerList);
    if (items.peerList) {
        Object.keys(items.peerList).forEach(socketId=>{
            peerElementList.push(<PeerElement key={socketId} peer={items.peerList[socketId]} socket={items.socket} />);
        })
    }
    return (
        <>
            {peerElementList}
            <button onClick={go}>Share Video</button>
        </>
    )
}