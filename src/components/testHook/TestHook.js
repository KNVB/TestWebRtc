import { useMeeting } from "./useMeeting";
import { Button, Col, Container, Row } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton';
import PeerElement from "./PeerElement";
export default function TestHook() {
    const [meeting, action] = useMeeting(null);
    let leaveMeeting = () => {

    }
    let joinMeeting = () => {
        try {
            action.joinMeeting(process.env.REACT_APP_SOCKET_URL + "c");
        } catch (error) {
            alert(error.message)
        }
    }
    let updateLocalPeerName = e => {
        action.setLocalPeerName(e.target.value);
    }
    return (
        <Container fluid className="p-0">
            {
                (meeting) &&
                <>
                    <Row className="border border-dark m-1 rounded-3">
                        <Col className="d-flex flex-row justify-content-center">
                            <input
                                onChange={updateLocalPeerName}
                                placeholder="Please enter your alias"
                                type="text"
                                value={meeting.getLocalPeerName()} />
                        </Col>
                    </Row>
                    <Row className="border border-dark m-1 rounded-3">
                        <Col className="d-flex flex-row justify-content-center">
                            <Button onClick={joinMeeting} className="m-1" disabled={(meeting.getPeerList() ? true : false)}>Join a meeting</Button>
                            <Button onClick={leaveMeeting} className="m-1" disabled={(meeting.getPeerList() === null)}>Leave the meeting</Button>
                        </Col>
                    </Row>
                    {
                        (meeting.getPeerList()) &&
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
                                            Peer Name:{meeting.getLocalPeerName()}(You)<br />
                                        </div>
                                        {
                                            Object.values(meeting.getPeerList()).map((peer) => (
                                                <PeerElement peer={peer} key={peer.peerId} />
                                            ))
                                        }
                                    </div>
                                </Col>
                            </Row>
                        </>
                    }
                </>
            }
        </Container>
    )
}