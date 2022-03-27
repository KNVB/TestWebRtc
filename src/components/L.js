import { useState } from 'react';
import { Button, Card,Col, Container,Row } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'

export default function L() {
    const [index, setIndex] = useState(0);
    let updateIndex = () => {
        let temp;
        if (index === 2) {
            temp = 0;
        } else {
            temp = index + 1;
        }
        setIndex(temp);
    }
    return (
        <Card className="p-1 vh-100 vw-100" variant="dark">
            <Card.Header className="border border-dark d-flex flex-row justify-content-center mb-1 rounded-3">
                <Button className="m-1">Connect</Button>
                <Button className="m-1">Disconnect</Button>
            </Card.Header>
            <Card.Body className="border border-dark d-flex flex-grow-1 m-0 p-1 rounded-3">
                <div className={'bg-danger ' + ((index === 0) ? "d-flex" : "d-none") + ' flex-grow-1'}>
                    1
                </div>
                <div className={((index === 1) ? "d-flex" : "d-none") + ' flex-grow-1 m-0'} >
                    <div className="bg-success d-flex flex-column flex-grow-1 p-1 rounded-3 text-white">
                        <div>
                            Guest List:
                        </div>
                        <Container className="border border-dark overflow-auto p-1 rounded-3" fluid>
                            <Row>
                                <Col>1</Col>
                            </Row>
                            <Row>
                                <Col>1</Col>
                            </Row>
                            <Row>
                                <Col>1</Col>
                            </Row>
                            <Row>
                                <Col>1</Col>
                            </Row>
                            <Row>
                                <Col>1</Col>
                            </Row>
                            <Row>
                                <Col>1</Col>
                            </Row>
                            <Row>
                                <Col>1</Col>
                            </Row>
                            <Row>
                                <Col>1</Col>
                            </Row>
                            <Row>
                                <Col>1</Col>
                            </Row>
                            <Row>
                                <Col>1</Col>
                            </Row>
                            <Row>
                                <Col>1</Col>
                            </Row>
                            <Row>
                                <Col>1</Col>
                            </Row>
                            <Row>
                                <Col>1</Col>
                            </Row>
                            <Row>
                                <Col>1</Col>
                            </Row>
                            <Row>
                                <Col>1</Col>
                            </Row>
                            <Row>
                                <Col>1</Col>
                            </Row>
                            <Row>
                                <Col>1</Col>
                            </Row>
                            <Row>
                                <Col>1</Col>
                            </Row>
                            <Row>
                                <Col>1</Col>
                            </Row>
                            <Row>
                                <Col>1</Col>
                            </Row>
                            <Row>
                                <Col>1</Col>
                            </Row>
                            <Row>
                                <Col>1</Col>
                            </Row>
                            <Row>
                                <Col>1</Col>
                            </Row>
                            <Row>
                                <Col>1</Col>
                            </Row>
                            <Row>
                                <Col>1</Col>
                            </Row>
                            <Row>
                                <Col>1</Col>
                            </Row>
                            <Row>
                                <Col>1</Col>
                            </Row>
                            <Row>
                                <Col>1</Col>
                            </Row>                                                                                                                
                        </Container>
                    </div>    
                </div>
                <div className={((index === 2) ? "d-flex" : "d-none") + ' flex-grow-1'}>
                    <div className="bg-primary d-flex flex-column flex-grow-1 text-white">
                        <div>
                            Global Message:
                        </div>
                        <div className="border border-dark d-flex flex-column flex-grow-1 m-0 p-1 rounded-3 overflow-auto" style={{ "height": "10em" }}>
                            <div>9999</div>
                            <div>dfsdfs</div>
                            <div>dfsdfs</div>
                            <div>dfsdfs</div>
                            <div>dfsdfs</div>
                            <div>dfsdfs</div>
                            <div>dfsdfs</div>
                            <div>dfsdfs</div>
                            <div>dfsdfs</div>
                            <div>dfsdfs</div>
                            <div>dfsdfs</div>
                            <div>dfsdfs</div>
                            <div>dfsdfs</div>
                            <div>dfsdfs</div>
                            <div>dfsdfs</div>
                            <div>dfsdfs</div>
                            <div>dfsdfs</div>
                            <div>dfsdfs</div>
                            <div>dfsdfs</div>
                            <div>dfsdfs</div>
                            <div>dfsdfs</div>
                            <div>dfsdfs</div>
                            <div>dfsdfs</div>
                            <div>dfsdfs</div>
                            <div>dfsdfs</div>
                            <div>dfsdfs</div>
                            <div>dfsdfs</div>
                            <div>dfsdfs</div>
                            <div>dfsdfs</div>
                            <div>dfsdfs</div>
                            <div>dfsdfs</div>
                            <div>dfsdfs</div>
                            <div>dfsdfs</div>
                            <div>dfsdfs</div>
                            <div>dfsdfs</div>
                            <div>1</div>
                        </div>
                    </div>
                </div>
            </Card.Body>
            <Card.Footer className="border border-dark d-flex flex-row justify-content-around mt-1 rounded-3">
                <Button >Send testing message to all peer</Button>
                <div className="align-items-center bg-primary d-flex flex-row p-1 rounded-3 text-white">
                    <div className="m-1">Share Video:</div>
                    <DropdownButton title="Yes" variant="primary">
                        <Dropdown.Item eventKey={false}>No</Dropdown.Item>
                        <Dropdown.Item eventKey={true}>Yes</Dropdown.Item>
                    </DropdownButton>
                </div>
                <Button onClick={updateIndex}>Go</Button>
            </Card.Footer>
        </Card>
    )
}