import {useEffect, useRef} from "react";
import Panel from "../share/panel/Panel";
import Peer from './Peer';
export default function TestPureWebRTC(){
    const panel=useRef();
    let localPeer;
    let sUsrAg = navigator.userAgent
    if (sUsrAg.indexOf("Chrome")>-1){
        localPeer=new Peer("Chrome");
    }else {
        localPeer=new Peer("Firefox");
    }    
    useEffect(()=>{
        localPeer.setMsgLogger(panel.current.addMsg);
        //localPeer.setDataChannelOpenHandler(dataChannelOpen);
    },[])
    let dataChannelOpen=(msg)=>{
        console.log(msg);
    }
    let call=()=>{
        //panel.current.addMsg("Make A Call");
        localPeer.call();        
    }
    let hangUp = () => {
        //panel.current.addMsg("Hang Up");
        localPeer.hangUp();
    }
    let controls = { call, hangUp};

    return(
        <Panel            
            controls={controls}
            ref={panel}/>
    ); 
}