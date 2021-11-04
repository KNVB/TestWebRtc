import './PeerElement.css';
import { useEffect, useRef } from "react";
export default function PeerElement({peer,socket}) {
    let media = useRef();
    useEffect(() => {
        //peer.setDebug(true);
        peer.on("connect",()=>{
            console.log("Connection to "+peer.name+ " is established.");
        })
        peer.on("signal",signalData=>{
            console.log("Send Signal Data to "+peer.name);
            socket.emit("sendSignalData",signalData)
        });
        peer.on("stream",stream=>{
            console.log(peer.name+" received stream event");
            media.current.srcObject=stream;
        });       
        socket.on("signalData",param=>{
            if (param.from === peer.socketId){
                peer.signal(param.signalData);
                console.log("Receive Signal Data from "+peer.name);                
            }
        });
       
        peer.init();
        if (peer.isCall){
            peer.call();
        }
        
    }, []);


    return (
        <div className="border border-info d-flex flex-row flex-grow-1 peer">
            <div className="w-50">
                <video autoPlay muted controls ref={media} />
            </div>
            <div className="w-50">
                {peer.name}
            </div>
        </div>
    )
};
