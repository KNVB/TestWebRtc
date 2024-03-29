import { useState } from 'react';
import { Button, Card, Col, Container, Row } from 'react-bootstrap';
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
    let cssClassFirst,cssClassEnd;
    let globalMessage = [];
    let guestList = [];

    globalMessage.push(<div key="msg_0">9999</div>);
    for (let i = 0; i < 98; i++) {
        globalMessage.push(<div key={"msg_" + globalMessage.length}>dfsdfs</div>);
    }
    globalMessage.push(<div key="msg_99">1</div>);
    for (let i = 0; i < 100; i++) {
        cssClassFirst="border border-warning p-1";
        cssClassEnd="border border-warning p-1";
        switch (i){
            case 0:
                cssClassFirst+=" border-bottom-0 border-end-0";
                cssClassEnd+=" border-bottom-0";
                break;
                
            case 99:
                cssClassFirst+=" border-end-0";
                break;
            
            default:
                cssClassFirst+=" border-bottom-0 border-end-0";
                cssClassEnd+=" border-bottom-0";
                break;         
        }

        guestList.push(
            <Row key={"guestList_" + i} className="m-0 p-0">
                <Col className={cssClassFirst} sm={4}><div style={{ "height": "200px", "width": "300px" }}>1</div></Col>
                <Col className={cssClassFirst} sm={4}><div style={{ "height": "200px", "width": "300px" }}>2</div></Col>
                <Col className={cssClassEnd} sm={4}><div style={{ "height": "200px", "width": "300px" }}>3</div></Col>
            </Row>
        );
    }
    //position-fixed w-100 can be fix the mobile browser 100% height problem
    //https://stackoverflow.com/questions/37112218/css3-100vh-not-constant-in-mobile-browser
    return (
        <Card className="h-100 p-1 position-fixed w-100" variant="dark">
            <Card.Header className="border border-dark d-flex flex-row justify-content-center mb-1 rounded-3">
                <Button className="m-1">Connect</Button>
                <Button className="m-1">Disconnect</Button>
            </Card.Header>
            <Card.Body className="border border-dark d-flex flex-grow-1 m-0 p-1 rounded-3">
                {
                    (index === 0) &&
                    <div className="bg-danger d-flex flex-grow-1">
                        1
                    </div>
                }

                {
                    (index === 1) &&
                    <Card className="bg-secondary d-flex flex-grow-1 m-0 p-0 rounded-5 text-white">
                        <Card.Header className="m-0 p-0">
                            Guest List:
                        </Card.Header>
                        <Card.Body className="bg-dark d-flex flex-column flex-grow-1 m-0 overflow-auto p-0" style={{ "height": "10em" }}>
                            {guestList}
                        </Card.Body>
                    </Card>
                }

                {
                    (index === 2) &&
                    <Container className="d-flex flex-grow-1 m-0 p-0" fluid>
                        <Row className="d-flex flex-grow-1 m-0 p-0">
                            <Col className="d-flex flex-grow-1 m-0 p-1 rounded-3 text-white" sm={6}>
                                <Card className="bg-primary d-flex flex-grow-1 m-0 p-0">
                                    <Card.Header className="m-0 p-0">
                                        Global Message:
                                    </Card.Header>
                                    <Card.Body className="bg-info d-flex flex-column flex-grow-1 m-0 overflow-auto p-0" style={{ "height": "10em" }}>
                                        {globalMessage}
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col className="d-flex flex-column flex-grow-1 m-0 p-1 rounded-3" sm={6}>
                                <textarea className="h-75 mb-2 rounded-3"></textarea>
                                <Button >Send testing message to all peer</Button>
                            </Col>
                        </Row>
                    </Container>
                }
            </Card.Body>
            <Card.Footer className="border border-dark d-flex flex-row justify-content-around mt-1 rounded-3">
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