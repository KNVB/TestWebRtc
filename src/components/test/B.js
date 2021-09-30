import { useEffect,useRef} from 'react';
import io from 'socket.io-client';
import MyPeer from './MyPeer';
export default function B(){
    
    let myPeer,peerName;
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
            console.log(peerName+" Connection established.");
        });
        myPeer.on('signal',data=>{
            //console.log(peerName+" send signal event.");
            signalSocket.emit("signalData",data);
        });
        
    },[])
    let call=()=>{
        signalSocket.emit('askConnect',peerName);
        myPeer.init();
        myPeer.call();
    }
    let hangUp = () => {
        myPeer.hangUp();
    }
    return(
        <div>
            <button onClick={call}>Call</button>
            <button onClick={hangUp}>Hang Up</button>
        </div>
    ); 
}