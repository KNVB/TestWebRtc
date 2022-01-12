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
    meeting.on("globalMessage", messageObj => {
      updateItemList({ type: "updateGlobalMessage", messageObj: messageObj });
    })
    updateItemList({ type: "init", "meeting": meeting, peerList: {},peerName:peerName});
  }, []);
  let reducer = (state, action) => {
    let result = { ...state };
    switch (action.type) {
      case "disconnect":
        result.globalMessageList=[];
        result.meeting.disconnect();        
        result.peerList = {};
        break;
      case "init":
        result.meeting = action.meeting;
        result.peerList = action.peerList;
        result.peerName = action.peerName;
        break;
      case "sendMsg":
        break;
      case "updateGlobalMessage":
        let temp=JSON.parse(JSON.stringify(result.globalMessageList));
        temp.push(action.messageObj);
        result.globalMessageList=temp;
        break;
      case "updatePeerList":
        result.peerList = action.peerList;
        break;
      default:
        break;
    }
    return result;
  }
  const [itemList, updateItemList] = useReducer(reducer, { peerList: {}, peerName:'', globalMessageList: [] });
  let connect = () => {
    itemList.meeting.connect();
  }
  let disconnect = () => {
    //itemList.meeting.disconnect();
    updateItemList({ type: "disconnect" })
  }

  let sendMessage = () => {
    let msg="你好!";
    itemList.meeting.sendGlobalMessage(msg);
    updateItemList({ type: "updateGlobalMessage", messageObj:{from:itemList.peerName,message:msg}});
  }
  return (
    <div className="m-2 w-100">
      <div className="m-2">
        <button onClick={connect}>Connect</button>
        <button onClick={disconnect}>Disconnect</button>
      </div>
      {
        (Object.values(itemList.peerList).length > 0) &&
        <div className="d-flex flex-column m-2">
          <div className="d-flex flex-row m-20">
            <div className="border border-dark border-end-0 p-1  w-50">
              <div>Global Message</div>
              <div>
                {
                  itemList.globalMessageList.map((msgObj, index) => (
                    <div key={index}>
                      <div>{msgObj.from}:</div>
                      <div>{msgObj.message}</div>
                    </div>
                  ))
                }
              </div>
            </div>
            <div className="border border-dark p-1 w-50">
              <div>
                Room member list:
              </div>
              <div className="border-dark border-top mt-2">
                {
                  Object.values(itemList.peerList).map((peer, index) => (
                    <div className="border-bottom border-dark" key={index}>
                      {peer.peerName}
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
          <div className="border-top border-dark d-flex justify-content-center m-2 p-2">
            <button onClick={sendMessage}>Send testing message to all peer</button>
          </div>
        </div>
      }
    </div>
  )
}