import { useMeeting } from "./useMeeting";
import { Button, Col, Container, Row } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton';
import PeerElement from "./PeerElement";
export default function TestHook() {
    const [
        globalMessageList, localPeer,
        peerList, localStream,
        joinMeeting, leaveMeeting, sendGlobalMessage,
        updateLocalPeerName, updateShareMedia] = useMeeting();
    let join = () => {
        try {
            joinMeeting(process.env.REACT_APP_SOCKET_URL + "c");
        } catch (e) {
            alert(e.message);
        }
    }
    let leave = () => {
        leaveMeeting();
    }
    let sendMessage = () => {
        let msg = "你好!";
        sendGlobalMessage(msg);
    }
    let updatePeerName = e => {
        updateLocalPeerName(e.target.value);
    }
    return (
        <Container fluid className="p-0">
            <Row className="border border-dark m-1 rounded-3">
                <Col className="d-flex flex-row justify-content-center">
                    <input type="text" placeholder="Please enter you alias here" onChange={updatePeerName} value={(localPeer ? localPeer.getPeerName() : '')} />
                </Col>
            </Row>
            <Row className="border border-dark m-1 rounded-3">
                <Col className="d-flex flex-row justify-content-center">
                    <Button onClick={join} className="m-1" disabled={(peerList !== null)}>Join a meeting</Button>
                    <Button onClick={leave} className="m-1" disabled={(peerList === null)}>Leave the meeting</Button>
                </Col>
            </Row>
            {
                peerList &&
                <>
                    <Row className="border-bottom-0 border-dark m-1 rounded-3">
                        <Col className="border border-dark border-end-0 p-1 rounded-3">
                            <div>Global Message</div>
                        </Col>
                        <Col className="border border-dark p-1 rounded-3">
                            <div>
                                Room member list:
                            </div>
                            <div className="mt-2 rounded-3">
                                <div className="border border-dark m-1 p-1 rounded-3">
                                    Peer Name:{localPeer.getPeerName()}(You)<br />
                                </div>
                                {
                                    Object.values(peerList).map((peer) => (
                                        <PeerElement peer={peer} key={peer.getPeerId()} />
                                    ))
                                }
                            </div>
                        </Col>
                    </Row>

                </>
            }
        </Container>
    )
}