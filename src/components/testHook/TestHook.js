import { useMeeting } from "./useMeeting";
import { Button, Col, Container, Row } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton';
import LocalMedia from './LocalMedia';
import PeerElement from "./PeerElement";
export default function TestHook() {
    const [data, action] = useMeeting(null);
    let leaveMeeting = () => {
        action.leaveMeeting();
    }
    let joinMeeting = () => {
        try {
            action.joinMeeting(process.env.REACT_APP_SOCKET_URL + "c", data.localPeer);
        } catch (error) {
            alert(error.message)
        }
    }
    let sendGlobalMessage = () => {
        let msg = "你好!";
        action.sendGlobalMessage(msg);
    }
    let updateLocalPeerName = e => {
        action.setLocalPeerName(e.target.value);
    }
    let updateShareAudioState = value =>{
        action.updateShareAudioState(value);
    }
    let updateShareVideoState = value =>{
        action.updateShareVideoState(value);
    }
    return (
        <Container fluid className="p-0">
            <Row className="border border-dark m-1 rounded-3">
                <Col className="d-flex flex-row justify-content-center">
                    <input
                        onChange={updateLocalPeerName}
                        placeholder="Please enter your alias"
                        type="text"
                        value={data.localPeer.getPeerName()} />
                </Col>
            </Row>
            <Row className="border border-dark m-1 rounded-3">
                <Col className="d-flex flex-row justify-content-center">
                    <Button onClick={joinMeeting} className="m-1" disabled={(data.peerList ? true : false)}>Join a meeting</Button>
                    <Button onClick={leaveMeeting} className="m-1" disabled={(data.peerList === null)}>Leave the meeting</Button>
                </Col>
            </Row>
            {
                data.peerList &&
                <>
                    <Row className="border-bottom-0 border-dark m-1 rounded-3">
                        <Col className="border border-dark border-end-0 p-1 rounded-3">
                            <div>Global Message</div>
                            {
                                data.globalMessageList.map((msgObj, index) => (
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
                                    Peer Name:{data.localPeer.getPeerName()}(You)<br />
                                </div>
                                {
                                    data.peerList.map((peer) => (
                                        <PeerElement peer={peer} key={peer.getPeerId()} />
                                    ))
                                }
                            </div>
                        </Col>
                    </Row>
                    <Row className="border border-dark m-1 rounded-3">
                        <Col className="d-flex flex-row justify-content-center p-2">
                            <Button onClick={sendGlobalMessage}>Send testing message to all peer</Button>
                        </Col>
                        <Col className="d-flex flex-row justify-content-center p-2">
                        <div className="align-items-center bg-primary d-flex flex-row p-1 rounded-3 text-white">
                                <div className="m-1">Share Audio:</div>
                                <DropdownButton onSelect={updateShareAudioState} title={((data.shareAudio) ? "Yes" : "No")} variant="primary">
                                    <Dropdown.Item eventKey={false}>No</Dropdown.Item>
                                    <Dropdown.Item eventKey={true}>Yes</Dropdown.Item>
                                </DropdownButton>
                            </div>
                            <div className="align-items-center bg-primary d-flex flex-row p-1 rounded-3 text-white">
                                <div className="m-1">Share Video:</div>
                                <DropdownButton onSelect={updateShareVideoState} title={((data.shareVideo) ? "Yes" : "No")} variant="primary">
                                    <Dropdown.Item eventKey={false}>No</Dropdown.Item>
                                    <Dropdown.Item eventKey={true}>Yes</Dropdown.Item>
                                </DropdownButton>
                            </div>                           
                        </Col>
                    </Row>
                    {
                        data.localStream && 
                        <LocalMedia localStream={data.localStream} />
                    }
                </>
            }
        </Container>
    )
}