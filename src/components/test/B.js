import { useEffect,useRef} from 'react';
import io from 'socket.io-client';
import MyPeer from './MyPeer';
import Panel from "../share/panel/Panel";
export default function B(){
    let myPeer,panel=useRef(),peerName;
    let signalSocket;
    let sUsrAg = navigator.userAgent;
   
    if (sUsrAg.indexOf("Chrome")>-1){
        peerName="Chrome";
    }else {
        peerName="Firefox";
    }
    myPeer=new MyPeer(peerName);
    myPeer.setDebug(true); 
    useEffect(()=>{
        signalSocket=io.connect(process.env.REACT_APP_SOCKET_URL+"test", { transports: ['websocket'] });
        signalSocket.on("requestConnect",(remotePeerName)=>{
            console.log('Received request connect event from '+remotePeerName);
            myPeer.init();
        });
        signalSocket.on("signalData",async (data)=>{
            //console.log(peerName+" receive Signal Data");
            try{
                await myPeer.signal(data);
            }catch (error){
                console.log(error);
            }
        });
        myPeer.on("connect",()=>{
            panel.current.addMsg(peerName+" Connection established.");
        });
        myPeer.on('signal',data=>{
            //console.log(peerName+" send signal event.");
            signalSocket.emit("signalData",data);
        });
        myPeer.on("close",()=>{
            panel.current.addMsg(peerName+" Connection closed.");
        })
        
    },[])
    let call=()=>{
        signalSocket.emit('askConnect',peerName);
        myPeer.init();
        myPeer.call();
    }
    let hangUp = () => {
        myPeer.hangUp();
    }
    let controls = { call, hangUp};
    return(
        <Panel            
        controls={controls}
        ref={panel}/>
    ); 
}