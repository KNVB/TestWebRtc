import { Button, Col, Container, Row } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'

export default function L() {
    return (
        <Container fluid className="border border-primary p-0 m-0 vh-100">
            <Row className="border border-dark rounded-3 p-0 m-1" style={{ "box-sizing": "border-box", "height": "10vh" }}>
                <Col className="d-flex flex-row justify-content-center">
                    <Button className="m-1">Connect</Button>
                    <Button className="m-1">Disconnect</Button>
                </Col>
            </Row>
            <Row className="border border-dark rounded-3 m-1 p-0" style={{ "box-sizing": "border-box", "height": "77.5vh" }}>
                <Col className="border border-dark m-1 p-2 d-flex flex-column rounded-3">
                    <div className='m-0 p-0'>Global Message</div>
                    <div className="border border-danger h-100 m-0 p-0 position-relative rounded-3 w-100">
                        <div className="h-100 w-100 m-0 p-1 position-absolute overflow-auto">
                            <div>Global Message</div>
                            <div>Global Message</div>
                            <div>Global Message</div>
                            <div>Global Message</div>
                            <div>Global Message</div>
                            <div>Global Message</div>
                            <div>Global Message</div>
                            <div>Global Message</div>
                            <div>Global Message</div>
                            <div>Global Message</div>
                            <div>Global Message</div>
                            <div>Global Message</div>
                            <div>Global Message</div>
                            <div>Global Message</div>
                            <div>Global Message</div>
                            <div>Global Message</div>
                            <div>Global Message</div>
                            <div>Global Message</div>
                            <div>Global Message</div>
                            <div>Global Message</div>
                            <div>Global Message</div>
                            <div>Global Message</div>
                            <div>Global Message</div>
                            <div>Global Message</div>
                            <div>Global Message</div>
                            <div>Global Message</div>
                            <div>Global Message</div>
                            <div>Global Message</div>
                            <div>Global Message</div>
                            <div>Global Message</div>
                            <div>Global Message</div>
                            <div>Global Message</div>
                            <div>Global Message</div>
                            <div>Global Message</div>
                            <div>Global Message</div>
                            <div>Global Message</div>
                            <div>Global Message</div>
                            <div>Global Message</div>
                            <div>Global Message</div>
                            <div>Global Message</div>
                            <div>Global Message</div>
                            <div>Global Message</div>
                            <div>Global Message</div>
                        </div>
                    </div>
                </Col>
                <Col className="border border-dark d-flex flex-column flex-grown-1 m-1 p-2 rounded-3">
                    <div>
                        Room member list:
                    </div>
                    <div className="border border-danger h-100 m-0 p-0 position-relative rounded-3 w-100">
                    <div className="h-100 w-100 m-0 p-1 position-absolute overflow-auto">
                            <div>Global Message</div>
                            <div>Global Message</div>
                            <div>Global Message</div>
                            <div>Global Message</div>
                            <div>Global Message</div>
                            <div>Global Message</div>
                            <div>Global Message</div>
                            <div>Global Message</div>
                            <div>Global Message</div>
                            <div>Global Message</div>
                            <div>Global Message</div>
                            <div>Global Message</div>
                            <div>Global Message</div>
                            <div>Global Message</div>
                            <div>Global Message</div>
                            <div>Global Message</div>
                            <div>Global Message</div>
                            <div>Global Message</div>
                            <div>Global Message</div>
                            <div>Global Message</div>
                            <div>Global Message</div>
                            <div>Global Message</div>
                            <div>Global Message</div>
                            <div>Global Message</div>
                            <div>Global Message</div>
                            <div>Global Message</div>
                            <div>Global Message</div>
                            <div>Global Message</div>
                            <div>Global Message</div>
                            <div>Global Message</div>
                            <div>Global Message</div>
                            <div>Global Message</div>
                            <div>Global Message</div>
                            <div>Global Message</div>
                            <div>Global Message</div>
                            <div>Global Message</div>
                            <div>Global Message</div>
                            <div>Global Message</div>
                            <div>Global Message</div>
                            <div>Global Message</div>
                            <div>Global Message</div>
                            <div>Global Message</div>
                            <div>Global Message</div>
                        </div>
                    </div>
                </Col>
            </Row>
            <Row className="border border-dark rounded-3 p-0 m-1" style={{ "box-sizing": "border-box", "height": "10vh" }}>
                <Col className="d-flex flex-row justify-content-center p-2">
                    <Button >Send testing message to all peer</Button>
                </Col>
                <Col className="d-flex flex-row justify-content-center p-2">
                    <div className="align-items-center bg-primary d-flex flex-row p-1 rounded-3 text-white">
                        <div className="m-1">Share Video:</div>
                        <DropdownButton title="Yes" variant="primary">
                            <Dropdown.Item eventKey={false}>No</Dropdown.Item>
                            <Dropdown.Item eventKey={true}>Yes</Dropdown.Item>
                        </DropdownButton>
                    </div>
                </Col>
            </Row>
        </Container>
    )
}