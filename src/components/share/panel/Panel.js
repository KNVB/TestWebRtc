import { Col,Container,Row } from "react-bootstrap";
import {useRef} from "react";
import MessageBox from "./MessageBox";
export default function Panel(props){
    const messageBox=useRef();
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
                <Col className="align-items-center border-start border-bottom border-end border-primary col-12 d-flex flex-row justify-content-center p-0">
                    <div className="btn-group-toggle d-flex justify-content-center p-1">
                        <button className="btn-sm btn btn-lg btn-success">Make A Call</button>
                    </div>                
                    <div className="btn-group-toggle d-flex justify-content-center p-1">
                        <button className="btn-sm btn btn-lg btn-success">Clear Log</button>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col className="align-items-center border-start border-bottom border-end border-primary col-12 d-flex flex-row justify-content-center p-0">
                    <div className="btn-group-toggle p-1">
                        <label className="btn-sm btn btn-lg btn-success">
                            Share 
                            <select name="videoSrc" className="bg-success text-white">
                                <option value="no" >No</option>
                                <option value="yes">Yes</option>
                            </select>
                            Video
                        </label>
                    </div>
                    <div className="btn-group-toggle p-1">
                        <label className="btn-sm btn btn-lg btn-success">
                            Share Audio
                            <select name="shareAudio" className="bg-success text-white">
                                <option value="no" >No</option>
                                <option value="yes">Yes</option>
                            </select>
                        </label>
                    </div>                    
                </Col>
            </Row>
            <Row>
                <Col className="align-items-center border-start border-bottom border-end border-primary col-12 d-flex flex-row justify-content-center p-0">
                    <div className="btn-group-toggle d-flex justify-content-center p-1">
                        <button className="btn-sm btn btn-lg btn-success">Hangup</button>
                    </div>
                    <div className="btn-group-toggle d-flex justify-content-center p-1">
                        <button className="btn-sm btn btn-lg btn-success">Copy log to clipboard</button>
                    </div>
                    <div className="btn-group-toggle d-flex justify-content-center p-1">
                        <button className="btn btn-lg btn-sm btn-danger">
                            Connection status:&nbsp;<span>closed</span>
                        </button>
                    </div>
                </Col>
            </Row>
            <MessageBox ref={messageBox}/>            
        </Container>
    )
}