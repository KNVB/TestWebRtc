import './PeerElement.css';
import { useEffect, useRef } from "react";
export default function PeerElement({call, peerObj,signalData}) {
    let media = useRef();
    useEffect(() => {
        peerObj.on("stream", stream => {
            media.current.srcObject = stream;
        });
        /*
        peerObj.on("signal",signalData=>{
            console.log("signal event recevied:");
            console.log(signalData);
        });
        */
        peerObj.on("connect",()=>{
            console.log("Connection to "+peerObj.name+" is established.");
        })
        peerObj.init();
        if (call){
            peerObj.call();
        }
        console.log(signalData);
    }, []);
    return (
        <div className="border border-info d-flex flex-row flex-grow-1 peer" key={peerObj.socketId}>
            <div className="w-50">
                <video autoPlay muted controls ref={media} />
            </div>
            <div className="w-50">
                {peerObj.name}
            </div>
        </div>
    )
};
