import { useRef, useState } from "react";
import Panel from "../share/panel/Panel";
import SimplePeer from 'simple-peer';
import io from 'socket.io-client';
export default function TestSimplePeer() {
    let [connectionState,setConnectionState]= useState("Close");
    const configuration = {iceServers: 
        [{urls: "stun:stun.stunprotocol.org"},
         {urls: "stun:stun.l.google.com:19302"},
         {urls: "turn:numb.viagenie.ca", credential: "turnserver", username: "sj0016092@gmail.com"},
        ]};
    const panel=useRef();
    let peer1,peer2;

    let socket1 = io.connect(process.env.REACT_APP_SOCKET_HOST+":" + process.env.REACT_APP_SOCKET_PORT+"/testSimplePeer", { transports: ['websocket'] });
    let socket2 = io.connect(process.env.REACT_APP_SOCKET_HOST+":" + process.env.REACT_APP_SOCKET_PORT+"/testSimplePeer", { transports: ['websocket'] });

    let call = () => {
        console.log("Make A Call");
        let localStream=panel.current.getLocalStream();
        peer1=new SimplePeer({config:configuration,initiator:true,stream:localStream});
        peer2=new SimplePeer({config:configuration});

        socket1.emit("newPeer");
        handle(socket1,peer1,1);
        handle(socket2,peer2,2);
    };
    let handle=(socket,peer,num)=>{
        socket.on("newPeer",()=>{
            console.log("Peer"+num+" Receive newPeer event");           
        });
        socket.on("signalData",data=>{
            console.log("Peer"+num+" Receive Signal Data");
            try{
                peer.signal(data);
            }catch (error){
                console.log(error);
            }
        });
        peer.on('close', () => {
            console.log("Peer"+num+" Connection closed.");
            setConnectionState("Close");
        })
        peer.on('connect', () => {
            console.log("Peer"+num+" Connection established.");            
        });
        peer.on('error', (err) => {
            console.log("Peer"+num+" Error occur:"+err);
        })
        peer.on('signal',data=>{
            console.log("Peer"+num+" receive signal event.");
            socket.emit("signalData",data);
        });
        peer.on('stream',stream=>{
            panel.current.setRemoteStream(stream);
        })
    }
    let hangUp = () => {
        console.log("Hang Up");
        //(panel.current.getLocalStream());
        peer1.destroy();
        peer2.destroy();        
    };
    /*
    let updateConnectionStatus=()=>{
        setConnectionState("Open");
    }*/
   
    let controls = { call, hangUp};
    return(
        <Panel
            connectionState={connectionState} 
            controls={controls}
            ref={panel}/>
    );  
}
