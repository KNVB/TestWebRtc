import { useRef, useState } from "react";
import Panel from "../share/panel/Panel";
import SimplePeer from 'simple-peer';
import io from 'socket.io-client';
export default function TestSimplePeer() {
    let [connectionState,setConnectionState]= useState("Close");
    const configuration = {iceServers: 
        [{urls: "stun:stun.stunprotocol.org"},
         {urls: "stun:stun.l.google.com:19302"},
         {urls: "turn:numb.viagenie.ca", credential: "turnserver", username: "sj0016092@gmail.com"}		
        ]};
    const panel=useRef();
    let peer1,peer2;

    let socket1 = io.connect("http://localhost:" + process.env.REACT_APP_SOCKET_PORT+"/testSimplePeer", { transports: ['websocket'] });
    let socket2 = io.connect("http://localhost:" + process.env.REACT_APP_SOCKET_PORT+"/testSimplePeer", { transports: ['websocket'] });

    let call = () => {
        console.log("Make A Call");
        let localStream=panel.current.getLocalStream();
        peer1=new SimplePeer({config:configuration,initiator:true,stream:localStream});

        socket1.emit("newPeer");
        handle(peer1,socket1);
        socket2.on("newPeer",()=>{
            //panel.current.addMsg("Socket2 receive newPeer event");
            peer2=new SimplePeer({config:configuration});
            handle(peer2,socket2);
        });
    };
    let handle=(peer,socket)=>{
        peer.on('connect', () => {
            console.log("Connection established.");
        });
        peer.on('error', (err) => {
            console.log(err);
        })
        peer.on('signal',data=>{
            //console.log("signal Event="+JSON.stringify(data));
            socket.emit("signalData",data);
        })
        peer.on('stream', stream => {
            console.log("rececive remote stream");
            panel.current.setRemoteStream(stream);
        })
        peer.on('track', (track, stream) => {
            console.log("receive remote track");
            console.log("This is a "+track.kind+" track");
        })
        socket.on("signalData",data=>{
            console.log("Receive Signal Data");
            peer.signal(data);
        });
    }
    let hangUp = () => {
        console.log("Hang Up");
        //(panel.current.getLocalStream());
        peer1.destroy();
        peer2.destroy();

        peer1=null;
        peer2=null;
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
