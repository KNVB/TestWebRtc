import { Col,Row } from "react-bootstrap";
import {forwardRef,useImperativeHandle,useState} from "react";
const MessageBox=forwardRef((props,ref)=>{
    const [messagesList,setMessagesList]=useState([]);
    const addMsg=async (msg)=>{
      setMessagesList([msg,...messagesList]);
    }
    useImperativeHandle(ref, () => ({
        addMsg:(msg)=>{
            addMsg(msg);
        }
    }));
    let msgList=[];
    for (let i=0;i<messagesList.length;i++){
        msgList.push(
            <div key={"msg_"+i}>{messagesList[i]}</div>
        )
    }
    //console.log(messagesList); 
    return (
            <Row className="position-relative vh-25">
                <Col className="border-bottom border-left border-primary border-right  
                                col-12 d-flex flex-column h-100 overflow-auto position-absolute p-0">
                    {msgList}
                </Col>
            </Row>
    )
  });
  export default MessageBox;