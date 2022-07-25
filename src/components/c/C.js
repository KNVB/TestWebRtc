import { useEffect, useReducer } from "react";
import { Button, Col, Container, Row } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'

import LocalMedia from './LocalMedia';
import LocalStreamManager from '../../util/LocalStreamManager';
import Meeting from "./Meeting";
import PeerElement from "./PeerElement";
let reducer = (state, action) => {
  let result = { ...state };
  switch (action.type) {
    case "disconnect":
      result.globalMessageList = [];
      result.localStream = null;
      result.meeting.disconnect();
      result.peerList = null;
      result.shareVideo = false;
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
    case "updatePeerName":
      result.peerName = action.peerName;
      break;
    case "updateShareVideoState":
      result.localStream = action.stream;
      result.shareVideo = action.state;
      if (result.shareVideo) {
        result.meeting.setLocalStream(action.stream);
      }
      break
    default:
      break;
  }
  return result;
}

export default function C() {
  const [itemList, updateItemList] = useReducer(reducer, {
    localStream: null,
    localStreamManager: new LocalStreamManager(),
    peerList: null,
    peerName: '',
    globalMessageList: [],
    shareVideo: false
  });
  let connect = () => {
    if ((itemList) && (itemList.peerName !== '')) {
      let meeting = new Meeting(itemList.peerName);
      meeting.on("peerListUpdated", peerList => {
        updateItemList({ type: "updatePeerList", peerList: peerList });
      });
      meeting.on("connectionTimeout", message => {
        alert(message);
        updateItemList({ type: "disconnect" });
      });
      meeting.on("globalMessage", messageObj => {
        updateItemList({ type: "updateGlobalMessage", messageObj: messageObj });
      })
      meeting.connect(process.env.REACT_APP_SOCKET_URL + "c");
      updateItemList({ type: "init", "meeting": meeting, peerList: null, peerName: itemList.peerName });      
    } else {
      alert("Please enter your alias before joining a meeting.");
    }
  }
  let disconnect = async () => {
    //itemList.meeting.disconnect();
    await itemList.localStreamManager.closeStream(itemList.localStream);
    updateItemList({ type: "disconnect" })
  }

  let sendMessage = () => {
    let msg = "你好!";
    itemList.meeting.sendGlobalMessage(msg);
    updateItemList({ type: "updateGlobalMessage", messageObj: { from: itemList.peerName, message: msg } });
  }
  let updatePeerName = e => {
    updateItemList({ type: "updatePeerName", "peerName": e.target.value });
  }
  let updateShareVideoState = async value => {
    let localStream = null;
    let isShareVideo = (value === "true");
    try {
      localStream = await itemList.localStreamManager.getMediaStream(isShareVideo, false);
    } catch (error) {
      console.log("Get Media Stream failure:" + error.message);
      localStream = null;
    } finally {
      if (localStream === null) {
        await itemList.localStreamManager.closeStream(itemList.localStream);
      }
      updateItemList({ type: "updateShareVideoState", state: isShareVideo, stream: localStream });
    }
  }

  return (
    <Container fluid className="p-0">
      <Row className="border border-dark m-1 rounded-3">
        <Col className="d-flex flex-row justify-content-center">
          <input type="text" placeholder="Please enter you alias here" onChange={updatePeerName} value={itemList.peerName} />
        </Col>
      </Row>
      <Row className="border border-dark m-1 rounded-3">
        <Col className="d-flex flex-row justify-content-center">
          <Button onClick={connect} className="m-1" disabled={!(itemList.peerList === null)}>Join a meeting</Button>
          <Button onClick={disconnect} className="m-1">Leave the meeting</Button>
        </Col>
      </Row>
      {
        (itemList.peerList) &&
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
                <div className="border border-dark m-1 p-1 rounded-3">
                  Peer Name:{itemList.meeting.getLocalPeer().peerName}(You)<br />
                </div>
                {
                  Object.values(itemList.peerList).map((peer) => (
                    <PeerElement peer={peer} key={peer.peerId} />
                  ))
                }
              </div>
            </Col>
          </Row>
          <Row className="border border-dark m-1 rounded-3">
            <Col className="d-flex flex-row justify-content-center p-2">
              <Button onClick={sendMessage}>Send testing message to all peer</Button>
            </Col>
            <Col className="d-flex flex-row justify-content-center p-2">
              <div className="align-items-center bg-primary d-flex flex-row p-1 rounded-3 text-white">
                <div className="m-1">Share Video:</div>
                <DropdownButton onSelect={updateShareVideoState} title={((itemList.shareVideo) ? "Yes" : "No")} variant="primary">
                  <Dropdown.Item eventKey={false}>No</Dropdown.Item>
                  <Dropdown.Item eventKey={true}>Yes</Dropdown.Item>
                </DropdownButton>
              </div>
            </Col>
          </Row>
          {
            (itemList.shareVideo) &&
            <LocalMedia localStream={itemList.localStream} />
          }
        </>
      }
    </Container>
  )
}