import {forwardRef,useImperativeHandle,useState} from "react";
const MessageBox=forwardRef((props,ref)=>{
    const [messagesList,setMessagesList]=useState([]);
    const addMsg=async (msg)=>{
      setMessagesList([msg,...messagesList]);
    }
    useImperativeHandle(ref, () => ({
        addMsg:(msg)=>{
            addMsg(msg);
        },
        clear:()=>{
            setMessagesList([]);
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
        <div className="d-flex flex-grow-1 position-relative">
            <div className="h-100 w-100 position-absolute overflow-auto">
                {msgList}
            </div>
        </div>    
    )
});
export default MessageBox;