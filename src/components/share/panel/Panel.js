import { Col,Container,Row } from "react-bootstrap"
export default function Panel(){
    return (
        <Container className="border-top border-primary d-flex flex-column" fluid={true} >
            <Row>
                <Col className="border-start border-bottom border-primary col-6 h4 p-1 mb-0">
                    Self View
                </Col>
                <Col className="border-start border-bottom border-end border-primary col-6 h4 p-1 mb-0">
                    Remote View
                </Col>
            </Row>
            <Row>
                <Col className="border-start border-bottom border-primary 
                                d-flex flex-grow-1 col-6 p-1 position-relative vh-25">
                    <video 
                        autoPlay={true}
                        controls
                        muted/>                
                </Col>
                <Col className="border-start border-bottom border-primary 
                                d-flex flex-grow-1 col-6 p-1 position-relative vh-25">
                    <video 
                        autoPlay={true}
                        controls
                        muted/>                
                </Col>
            </Row>
            <Row>
                <Col className="align-items-center border-left border-bottom border-end border-primary col-12 d-flex flex-row justify-content-center p-0">
                    <div className="btn-group-toggle d-flex justify-content-center p-1">
                        <button className="btn-sm btn btn-lg btn-success">Make A Call</button>
                    </div>
                
                    <div className="btn-group-toggle d-flex justify-content-center p-1">
                        <button className="btn-sm btn btn-lg btn-success">Clear Log</button>
                    </div>
                </Col>
            </Row>
        </Container>
    )
}