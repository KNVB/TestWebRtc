import { useEffect, useReducer } from "react";
import io from "socket.io-client";
import PeerElement from "./PeerElement";
export default function TestSocket() {
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
  let reducer = (state, action) => {
    let result = { ...state };
    switch (action.type) {
      case "init":
        result.peerInfoList = action.peerInfoList;
        result.socket = action.socket;
        break;
      case "newPeer":
        result.peerInfoList[action.newPeer.socketId] = {
          call: true,
          name: action.newPeer.name,
          socketId: action.newPeer.socketId,
        };
        break;
      case "removePeer":
        delete result.peerInfoList[action.socketId];
        break;
      case "setPeerList":
        let temp = {};
        Object.keys(action.peerInfoList).forEach((key) => {
          let peerInfo = action.peerInfoList[key];
          temp[key] = {
            call: false,
            name: peerInfo.name,
            socketId: peerInfo.socketId,
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
    let socket = io(process.env.REACT_APP_SOCKET_URL + "a", {
      transports: ["websocket"],
    });
    setItem({ type: "init", peerInfoList: {}, socket: socket });

    socket.emit("hi", peerName, (response) => {
      console.log(response.peerList);
      setItem({ type: "setPeerList", peerInfoList: response.peerList });
    });
    socket.on("newPeer", (newPeer) => {
      setItem({ type: "newPeer", newPeer: newPeer });
    });
    socket.on("removePeer", (socketId) => {
      setItem({ type: "removePeer", socketId: socketId });
    });
  }, [peerName]);
  let peerElementList = [];
  const [items, setItem] = useReducer(reducer, {});
  console.log(items);
  if (items.peerInfoList) {
    Object.keys(items.peerInfoList).forEach((key) => {
      peerElementList.push(<PeerElement key={key} peerInfo={items.peerInfoList[key]} socket={items.socket}/>);
    });
  }
  return <>{peerElementList}</>;
}
