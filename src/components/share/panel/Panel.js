import {Button, Col, Container,Row } from "react-bootstrap";
import { useRef } from "react";
import MessageBox from "./MessageBox";
export default function Panel(props) {
  const messageBox = useRef();
  return (
    <Container
      className="border border-primary d-flex flex-column p-0 m-0"
      fluid={true}
    >
      <Row className="me-1 ms-1 mt-1 p-0">
        <Col className="border-primary border-start border-top col-6 h4 p-1 mb-0">
          Self View
        </Col>
        <Col className="border border-bottom-0 border-primary col-6 h4 p-1 mb-0">
          Remote View
        </Col>
      </Row>
      <Row className="me-1 ms-1 p-0">
        <Col className="border-primary border-start border-top col-6 h4 p-1 mb-0">
            <video 
                autoPlay={true}
                controls
                muted/>
        </Col>
        <Col className="border border-bottom-0 border-primary col-6 h4 p-1 mb-0">
            <video 
                autoPlay={true}
                controls
                muted/>
        </Col>
      </Row>
      <Row className="me-1 ms-1 p-0">
        <Col className="border-primary border-start border-top col-6 d-flex justify-content-end p-1 mb-0">
            <Button variant="success">Make A Call</Button>
        </Col>
        <Col className="border border-bottom-0 border-primary col-6 p-1 mb-0">
            <Button variant="success">Clear Log</Button>
        </Col>
      </Row>
      <Row className="me-1 ms-1 p-0">
        <Col className="border-primary border-start border-top col-6 d-flex justify-content-end p-1 mb-0">
            <label className="btn-sm btn btn-lg btn-success">
                Share Video
                <select name="videoSrc" className="bg-success text-white">
                    <option value="no" >No</option>
                    <option value="yes">Yes</option>
                </select>
            </label>
        </Col>
        <Col className="border border-bottom-0 border-primary col-6 p-1 mb-0">
        <label className="btn-sm btn btn-lg btn-success">
                Share Audio
                <select name="videoSrc" className="bg-success text-white">
                    <option value="no" >No</option>
                    <option value="yes">Yes</option>
                </select>
            </label>
        </Col>
      </Row>
      <Row className="me-1 ms-1 p-0">
        <Col className="border-primary border-end border-start border-top col-12 d-flex justify-content-center p-1 mb-0">
            <Button variant="success">Hangup</Button>&nbsp;
            <Button variant="success">Copy log to clipboard</Button>&nbsp;
            <Button variant="danger">Connection status:&nbsp;<span>closed</span></Button>
        </Col>
      </Row>
      <Row className="d-flex flex-grow-1 mb-1 me-1 ms-1 p-0 position-relative vh-25">
        <Col className="border-primary border col-12 m-0 p-0">
            <div className="h-100 positon-absolute overflow-scroll">
                sdsdsd<br/>
                sdsdsd<br/>
                sdsdsd<br/>
                sdsdsd<br/>
                sdsdsd<br/>
                sdsdsd<br/>
                sdsdsd<br/>
                sdsdsd<br/>
                sdsdsd<br/>
                sdsdsd<br/>
                sdsdsd<br/>
                sdsdsd<br/>
                sdsdsd<br/>
                sdsdsd<br/>
                sdsdsd<br/>
                sdsdsd<br/>
                sdsdsd<br/>
                sdsdsd<br/>
                sdsdsd<br/>
                sdsdsd<br/>
                sdsdsd<br/>
                sdsdsd<br/>
                sdsdsd<br/>
                sdsdsd<br/>
                sdsdsd<br/>
                sdsdsd<br/>
                sdsdsd<br/>
                sdsdsd<br/>
                sdsdsd<br/>
                sdsdsd<br/>
                sdsdsd<br/>
                sdsdsd<br/>
            </div>
        </Col>
      </Row>
    </Container>
  );
}
