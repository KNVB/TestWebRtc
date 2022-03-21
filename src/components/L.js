import { useState } from 'react';
import { Button, Card, Carousel } from 'react-bootstrap';
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
                <Carousel
                    activeIndex={index}
                    className="d-flex flex-grow-1 m-0 p-0 rounded-3"
                    controls={false}
                    interval={10000}
                    indicators={false}
                    nextIcon={null} nextLabel={null}
                    prevIcon={null} prevLabel={null}>
                    <Carousel.Item className="border border-dark h-100 m-0 p-0 rounded-3">
                        1
                    </Carousel.Item>
                    <Carousel.Item className="border border-dark h-100 m-0 p-0 rounded-3">
                        2
                    </Carousel.Item>
                    <Carousel.Item className="border border-dark h-100 m-0 p-0 rounded-3">
                        <div className="border border-white d-flex flex-column flex-grow-1 h-100 m-0 p-1 rounded-3">
                            <div>
                                Global Message:
                            </div>
                            <div className="border border-dark d-flex flex-column-reverse flex-grow-1 m-0 p-1 rounded-3 overflow-auto" style={{ "height": "10em" }}>
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
                    </Carousel.Item>
                </Carousel>
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