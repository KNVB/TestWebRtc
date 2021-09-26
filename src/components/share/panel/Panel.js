import { Button, Col, Container, Row } from "react-bootstrap";
import { useEffect, useRef } from "react";
import MessageBox from "./MessageBox";
import MediaPlayer from "./MediaPlayer";
export default function Panel(props) {
  let controls = props.controls;
  const localMedia = useRef(),
    remoteMedia = useRef();
  const messageBox = useRef();
/*  
  useEffect(()=>{
    setInterval(()=>{
      let now=new Date();
      messageBox.current.addMsg(now.getHours()+":"+now.getMinutes()+":"+now.getSeconds());
    },1000);
  },[]);
*/  
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
          <MediaPlayer ref={localMedia} />
        </Col>
        <Col className="border border-bottom-0 border-primary col-6 h4 p-1 mb-0">
          <MediaPlayer ref={remoteMedia} />
        </Col>
      </Row>
      <Row className="me-1 ms-1 p-0">
        <Col className="border-primary border-start border-top col-6 d-flex justify-content-end p-1 mb-0">
          <Button variant="success" onClick={() => controls.call()}>
            Make A Call
          </Button>
        </Col>
        <Col className="border border-bottom-0 border-primary col-6 p-1 mb-0">
          <Button variant="success" onClick={()=>messageBox.current.clear()}>Clear Log</Button>
        </Col>
      </Row>
      <Row className="me-1 ms-1 p-0">
        <Col className="border-primary border-start border-top col-6 d-flex justify-content-end p-1 mb-0">
          <label className="btn-sm btn btn-lg btn-success">
            Share Video
            <select
              className="bg-success text-white"
              onChange={(e) => controls.setShareVideo(e.target.value)}
            >
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </label>
        </Col>
        <Col className="border border-bottom-0 border-primary col-6 p-1 mb-0">
          <label className="btn-sm btn btn-lg btn-success">
            Share Audio
            <select
              className="bg-success text-white"
              onChange={(e) => controls.setShareAudio(e.target.value)}
            >
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </label>
        </Col>
      </Row>
      <Row className="me-1 ms-1 p-0">
        <Col className="border-primary border-end border-start border-top col-12 d-flex justify-content-center p-1 mb-0">
          <Button variant="success" onClick={()=> controls.hangUp()}>
            Hangup
          </Button>
          &nbsp;
          <Button variant="success">Copy log to clipboard</Button>&nbsp;
          <Button variant="danger">
            Connection status:&nbsp;<span>{props.connectionState}</span>
          </Button>
        </Col>
      </Row>
      <Row className="mb-1 me-1 ms-1" style={{ height: "20vh" }}>
        <Col className="border-primary border col-12 d-flex flex-grow-1 m-0 p-0">
          <MessageBox ref={messageBox} />
        </Col>
      </Row>
    </Container>
  );
}
