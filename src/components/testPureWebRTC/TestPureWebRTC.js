import { useEffect,useRef} from 'react';
import io from 'socket.io-client';
import MyPeer from './MyPeer';
import Panel from "../share/panel/Panel";
export default function TestPureWebRTC(){
    let myPeer,panel=useRef(),peerName;
    let signalSocket=io.connect(process.env.REACT_APP_SOCKET_URL+"testPureWebRTC", { transports: ['websocket'] });
    let sUsrAg = navigator.userAgent;
   
    if (sUsrAg.indexOf("Chrome")>-1){
        peerName="Chrome";
    }else {
        peerName="Firefox";
    }
    myPeer=new MyPeer(peerName);
    myPeer.setDebug(true); 
    useEffect(()=>{
        signalSocket.on("requestConnect",(remotePeerName)=>{
            console.log('Received request connect event from '+remotePeerName);
            myPeer.init();
        });
        signalSocket.on("signalData",async (data)=>{
            //console.log(peerName+" receive Signal Data");
            try{
                await myPeer.signal(data);
            }catch (error){
                panel.current.addMsg(error);
            }
        });
        myPeer.on("connect",()=>{
            panel.current.addMsg(peerName+" Connection established.");
            panel.current.updateConnectionState("Open");
        });
        myPeer.on("data",(data)=>{
            panel.current.addMsg(peerName+" receive data:"+data);
        })
        myPeer.on('signal',data=>{
            //console.log(peerName+" send signal event.");
            signalSocket.emit("signalData",data);
        });
        myPeer.on("close",()=>{
            panel.current.addMsg(peerName+" Connection closed.");
            panel.current.updateConnectionState("Close");
        })
        myPeer.on("stream",(stream)=>{
            panel.current.setRemoteStream(stream);
        })
    },[myPeer,peerName,signalSocket]);
    let call=()=>{
        signalSocket.emit('askConnect',peerName);
        myPeer.init();
        myPeer.call();
    }
    let getLocalStream=(localStream)=>{
        myPeer.setStream(localStream);        
    }
    let hangUp = () => {
        myPeer.hangUp();
    }
    let controls = { call,getLocalStream, hangUp};
    return(
        <Panel            
        controls={controls}
        ref={panel}/>
    ); 
}