import { useEffect, useReducer } from "react";
import { Button, Col, Container, Row } from 'react-bootstrap';
import Meeting from "./Meeting";
import PeerElement from "./PeerElement";
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
      Object.values(peerList).forEach(peer=>{
        console.log(peer.peerName+","+peer.getConnectionState());
      });      
      updateItemList({ type: "updatePeerList", peerList: peerList });
    });
    meeting.on("globalMessage", messageObj => {
      updateItemList({ type: "updateGlobalMessage", messageObj: messageObj });
    })
    updateItemList({ type: "init", "meeting": meeting, peerList: {}, peerName: peerName });
  }, []);
  let reducer = (state, action) => {
    let result = { ...state };
    switch (action.type) {
      case "disconnect":
        result.globalMessageList = [];
        result.meeting.disconnect();
        result.peerList = {};
        break;
      case "init":
        result.meeting = action.meeting;
        result.peerList = action.peerList;
        result.peerName = action.peerName;
        break;     
      case "updateGlobalMessage":
        let temp = JSON.parse(JSON.stringify(result.globalMessageList));
        temp.push(action.messageObj);
        result.globalMessageList = temp;
        break;
      case "updatePeerList":
        result.peerList = action.peerList;
        break;
      default:
        break;
    }
    return result;
  }
  const [itemList, updateItemList] = useReducer(reducer, { peerList: {}, peerName: '', globalMessageList: [] });
  let connect = () => {
    itemList.meeting.connect();
  }
  let disconnect = () => {
    //itemList.meeting.disconnect();
    updateItemList({ type: "disconnect" })
  }

  let sendMessage = () => {
    let msg = "你好!";
    itemList.meeting.sendGlobalMessage(msg);
    updateItemList({ type: "updateGlobalMessage", messageObj: { from: itemList.peerName, message: msg } });
  }
  return (
    <Container fluid className="p-0">
      <Row className="border border-dark m-1 rounded-3">
        <Col className="d-flex flex-row justify-content-center">
          <Button onClick={connect} className="m-1">Connect</Button>
          <Button onClick={disconnect} className="m-1">Disconnect</Button>
        </Col>
      </Row>
      {
        (Object.values(itemList.peerList).length > 0) &&
        <>
          <Row className="border-bottom-0 border-dark m-1 rounded-3">
            <Col className="border border-dark border-end-0 p-1 rounded-3">
              <div>Global Message</div>
              {
                itemList.globalMessageList.map((msgObj, index) => (
                  <div key={index}>
                    <div>{msgObj.from}:</div>
                    <div>{msgObj.message}</div>
                  </div>
                ))
              }
            </Col>
            <Col className="border border-dark p-1 rounded-3">
              <div>
                Room member list:
              </div>
              <div className="mt-2 rounded-3">
                {
                  Object.values(itemList.peerList).map((peer, index) => (
                    <PeerElement peer={peer} key={index}/>  
                  ))
                }
              </div>
            </Col>
          </Row>
          <Row className="border border-dark m-1 rounded-3">
            <Col className="d-flex flex-row justify-content-center p-2">
              <Button onClick={sendMessage}>Send testing message to all peer</Button>
            </Col>
          </Row>
        </>
      }
    </Container>
  )
}