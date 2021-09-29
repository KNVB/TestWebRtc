import { useEffect,useRef,useState } from 'react';
import Panel from "../share/panel/Panel";
import WebRTC from './WebRTC';
export default function A(){
    let panel=useRef(),peerName;
    const[webRTC,setWebRTC]=useState();

    let sUsrAg = navigator.userAgent;    
    if (sUsrAg.indexOf("Chrome")>-1){
        peerName="Chrome";
    }else {
        peerName="Firefox";
    }
    useEffect(()=>{
        let temp=new WebRTC(peerName);
        //temp.setMsgLogger(panel.current.addMsg);
        temp.setMsgLogger(console.log);
        temp.setDataChannelCloseHandler(dataChannelCloseHandler);
        temp.setDataChannelOpenHandler(dataChannelOpenHandler);
        setWebRTC(temp);
    },[])
    let call=()=>{
        //panel.current.addMsg("Make A Call");
        webRTC.call();
    }
    let dataChannelCloseHandler=()=>{
        panel.current.updateConnectionState("Close");
    }

    let dataChannelOpenHandler=()=>{
        panel.current.updateConnectionState("Open");
    }
    let hangUp = () => {
        panel.current.addMsg("Hang Up");
        webRTC.hangUp();
    }
    let controls = { call, hangUp};
    return(
        <Panel            
            controls={controls}
            ref={panel}/>
    ); 
}