import './PeerElement.css';
import { useEffect, useRef } from "react";
import Peer from './Peer';
export default function PeerElement({peerInfo,socket}) {
    let media = useRef();
    useEffect(() => {
        console.log(peerInfo);
        let peer=new Peer(peerInfo.name,peerInfo.socketId);
        peer.on("connect",()=>{
            console.log("Connection to "+peerInfo.name+ " is established.");
        })
        peer.on("signal",signalData=>{
            console.log("Send Signal Data to "+peerInfo.name);
            socket.emit("sendSignalData",{"signalData":signalData,to:peerInfo.socketId})
        });
        
        socket.on("signalData",param=>{
            if (param.from === peerInfo.socketId){
                peer.signal(param.signalData);
                console.log("Receive Signal Data from "+peerInfo.name);
            }
        });

        peer.init();
        if (peerInfo.call){
            peer.call();
        }
    }, []);


    return (
        <div className="border border-info d-flex flex-row flex-grow-1 peer">
            <div className="w-50">
                <video autoPlay muted controls ref={media} />
            </div>
            <div className="w-50">
                {peerInfo.name}
            </div>
        </div>
    )
};
