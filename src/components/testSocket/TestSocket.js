import { useEffect } from "react";
import io from "socket.io-client";
export default function TestSocket() {
    useEffect(() => {
        let peerName;
        let sUsrAg = navigator.userAgent;
        if (sUsrAg.indexOf("Edg") > -1) {
            peerName = "Edge";
        } else {
            if (sUsrAg.indexOf("Chrome") > -1) {
                peerName = "Chrome";
            } else {
                if (sUsrAg.indexOf("Firefox") > -1) {
                    peerName = "Firefox";
                } else {
                    if (sUsrAg.indexOf("Safari") > -1) {
                        peerName = "Safari";
                    }
                }
            }
        }
        let socket = io(process.env.REACT_APP_SOCKET_URL + "a", {
            transports: ["websocket"],
        });
        socket.on("connect", () => {
            const engine = socket.io.engine;
            console.log(engine.transport.name);
            console.log("Connect to server established.");
            socket.io.on("reconnect", () => {
                console.log("Reconnect successed.");
            });
            socket.on("disconnect", (reason) => {
                console.log("socket disconnect event occur:"+reason);
            });
            engine.on("close", (reason) => {
                // called when the underlying connection is closed
                console.log("Engine Close event occured:"+reason);
            });    
        });
    }, [])
    return (
        <>
        </>
    )
}