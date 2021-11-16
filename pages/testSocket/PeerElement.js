import styles from './PeerElement.module.css';
import { useEffect, useRef } from "react";
export default function PeerElement({peer,meeting}) {
    let media = useRef();
    useEffect(() => {
        //peer.setDebug(true);
        peer.on("connect",()=>{
            console.log("Connection to "+peer.name+ " is established.");
        })
        peer.on("signal",signalData=>{
            console.log("Send Signal Data to "+peer.name);
            meeting.sendSignalData(signalData);
        });
        peer.on("stream",stream=>{
            console.log(peer.name+" received stream event");
            media.current.srcObject=stream;
        });
        peer.init();
        if (peer.isCall){
            peer.call();
        }
    }, [peer,meeting]);


    return (
        <div className={styles.peer + " border border-info d-flex flex-row flex-grow-1"}>
            <div className="w-50">
                <video className={styles.videoTag} autoPlay muted controls ref={media} />
            </div>
            <div className="w-50">
                {peer.name}
            </div>
        </div>
    )
};