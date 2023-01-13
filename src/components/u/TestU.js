import { useMeeting } from "./useMeeting";
import { Button, Card } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton';
import LocalMedia from './LocalMedia';
import PeerElement from "./PeerElement";
export default function TestU() {
    const [
        globalMessage,
        globalMessageList,
        isJoined,
        isShareAudio,
        isShareVideo,
        localPeer,
        localStream,
        peerList,
        meeting,
    ] = useMeeting(true);
    let leave = () => {
        meeting.leave();
    }
    let join = () => {
        try {
            meeting.join(process.env.REACT_APP_SOCKET_URL + "t");
        } catch (error) {
            alert(error.message)
        }
    }
    let sendGlobalMessage = () => {
        try {
            meeting.sendGlobalMessage();
        } catch (error) {
            alert(error.message)
        }
    }
    let updateGlobalMessage = e => {
        meeting.setGlobalMessage(e.target.value);
    }
    let updateLocalPeerName = e => {
        meeting.setLocalPeerName(e.target.value);
    }
    let setShareAudio = value => {
        meeting.setShareAudio(value);
    }
    let setShareVideo = value => {
        meeting.setShareVideo(value);
    }
    return (
        <Card className="vh-100 p-1 w-100" variant="dark">
            <Card.Header className='border border-dark m-1 p-0 rounded text-center'>
                <input
                    className="mt-1"
                    onChange={updateLocalPeerName}
                    placeholder="Please enter your alias"
                    type="text"
                    value={localPeer.peerName} />
                <div className="d-flex flex-row justify-content-center">
                    <Button className="m-1" disabled={isJoined} onClick={join}>Join a meeting</Button>
                    <Button className="m-1" disabled={!isJoined} onClick={leave}>Leave the meeting</Button>
                </div>
            </Card.Header>
            {
                isJoined &&
                <>
                    <Card.Body className='border border-dark d-flex m-1 p-0 rounded'>
                        <div className="d-flex flex-row flex-grow-1">
                            <Card className="d-flex flex-grow-1 m-1 rounded">
                                <Card.Header className="m-1 rounded">Global Message</Card.Header>
                                <Card.Body className="m-0 p-0 position-relative rounded">
                                    <div className='h-100 m-0 p-0 position-absolute w-100 overflow-auto'>
                                        {
                                            globalMessageList.map((msgObj, index) => (
                                                <div key={index}>
                                                    <div>{msgObj.from}:</div>
                                                    <div>{msgObj.message}</div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </Card.Body>
                            </Card>
                        </div>
                        <div className="border border-dark d-flex flex-column flex-grow-1 m-1 rounded">
                            <Card.Header className="card.header m-1 p-1 rounded">Room member list:</Card.Header>
                            <div className="border border-dark m-1 p-1 rounded">
                                Peer Name:{localPeer.peerName}(You)<br />
                            </div>
                            <div className="d-flex flex-column flex-grow-1 position-relative">
                                <div className='d-flex flex-column h-100 m-0 p-0 position-absolute w-100 overflow-auto'>
                                    {
                                        Object.values(peerList).map((peer) => (
                                            <PeerElement peer={peer} key={peer.peerId} />
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    </Card.Body>
                    <Card.Footer className='border border-dark m-1 p-0 rounded text-center'>
                        <div className='d-flex flex-grow-1 flex-row justify-content-center p-1'>
                            <input
                                onChange={updateGlobalMessage}
                                placeholder="Please enter your global message"
                                type="text"
                                value={globalMessage} />
                            &nbsp;
                            <Button onClick={sendGlobalMessage}>Send message to all peer</Button>
                        </div>
                        <div className='d-flex flex-grow-1 flex-row justify-content-center p-1'>
                            <div className="align-items-center bg-primary d-flex flex-row p-1 rounded-3 text-white">
                                <div className="m-1">Share Audio:</div>
                                <DropdownButton onSelect={setShareAudio} title={((isShareAudio) ? "Yes" : "No")} variant="primary">
                                    <Dropdown.Item eventKey={false}>No</Dropdown.Item>
                                    <Dropdown.Item eventKey={true}>Yes</Dropdown.Item>
                                </DropdownButton>
                            </div> &nbsp;
                            <div className="align-items-center bg-primary d-flex flex-row p-1 rounded-3 text-white">
                                <div className="m-1">Share Video:</div>
                                <DropdownButton onSelect={setShareVideo} title={((isShareVideo) ? "Yes" : "No")} variant="primary">
                                    <Dropdown.Item eventKey={false}>No</Dropdown.Item>
                                    <Dropdown.Item eventKey={true}>Yes</Dropdown.Item>
                                </DropdownButton>
                            </div>
                        </div>
                    </Card.Footer>
                    {
                        (isShareVideo) &&
                        <LocalMedia localStream={localStream} />
                    }
                </>
            }
        </Card>
    )
}