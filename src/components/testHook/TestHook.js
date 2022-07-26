import { useMeeting } from "./useMeeting";
import { Button, Col, Container, Row } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton';
import PeerElement from "./PeerElement";
export default function TestHook() {
    const [data, action] = useMeeting(null);
    let leaveMeeting = () => {
        action.leaveMeeting();
    }
    let joinMeeting = () => {
        try {
            action.joinMeeting(process.env.REACT_APP_SOCKET_URL + "c",data.localPeer);
        } catch (error) {
            alert(error.message)
        }
    }
    let updateLocalPeerName = e => {
        action.setLocalPeerName(e.target.value);
    }
    return (
        <Container fluid className="p-0">
            <Row className="border border-dark m-1 rounded-3">
                <Col className="d-flex flex-row justify-content-center">
                    {
                        data.localPeer &&
                        <input
                            onChange={updateLocalPeerName}
                            placeholder="Please enter your alias"
                            type="text"
                            value={data.localPeer.getPeerName()} />
                    }
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
                                Peer Name:{data.localPeer.getPeerName()}(You)<br />
                            </div>
                            {
                                Object.values(data.peerList).map((peer) => (
                                    <PeerElement peer={peer} key={peer.getPeerId()} />
                                ))
                            }
                        </div>
                    </Col>
                </Row>
            }
        </Container>
    )
}