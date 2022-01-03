import { useEffect, useReducer } from "react";
import Meeting from "./Meeting";
export default function C() {
  useEffect(() => {
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
    let meeting = new Meeting(peerName);
    meeting.on("peerListUpdated", peerList => {
      updateItemList({ type: "updatePeerList", peerList: peerList });
    });
    updateItemList({ type: "init", "meeting": meeting, peerList: {} });
  }, []);
  let reducer = (state, action) => {
    let result = { ...state };
    switch (action.type) {
      case "disconnect":
        result.meeting.disconnect();
        result.peerList = {};
        break;
      case "init":
        result.meeting = action.meeting;
        result.peerList = action.peerList;
        result.peerName = action.peerName;
        break;
      case "updatePeerList":
        result.peerList = action.peerList;
        break;
      default:
        break;
    }
    return result;
  }
  const [itemList, updateItemList] = useReducer(reducer, {});
  let connect = () => {
    itemList.meeting.connect();
  }
  let disconnect = () => {
    //itemList.meeting.disconnect();
    updateItemList({ type: "disconnect" })
  }
  return (
    <div>
      <button onClick={connect}>Connect</button>
      <button onClick={disconnect}>Disconnect</button>
      {itemList.peerList &&
        Object.values(itemList.peerList).map((peer, index) => (
          <div key={index}>
            {peer.peerName}
          </div>
        ))
      }
    </div>
  )
}