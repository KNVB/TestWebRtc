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
        temp.setMsgLogger(panel.current.addMsg);
        setWebRTC(temp);
    },[])
    let call=()=>{
        //panel.current.addMsg("Make A Call");
        webRTC.call();
    }
    let hangUp = () => {
        //panel.current.addMsg("Hang Up");
        webRTC.hangUp();
    }
    let controls = { call, hangUp};
    return(
        <Panel            
            controls={controls}
            ref={panel}/>
    ); 
}