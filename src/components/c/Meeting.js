import io from 'socket.io-client';
export default class Meeting{
    constructor(peerName){
        let socket=null;
        console.log("Meeting Object constructor is called.")
        this.connect=()=>{
            socket= io(process.env.REACT_APP_SOCKET_URL + "c", {
                transports: ["websocket"],
            });
            socket.on("askConnect",peerName=>{
                console.log("Receive Hi Event from "+peerName+".");
            });
            socket.on("askReconnect",peerName=>{
                console.log("Receive askReconnect Event from "+peerName+".");
            });
            socket.io.on("reconnect", () => {
                console.log("Reconnect successed.");
                socket.emit("reconnectRequest",peerName);
            });
            socket.emit("hi",peerName);
            
        }
        this.disconnect=()=>{
            if (socket){
                socket.disconnect();
            }            
        }
    }
}