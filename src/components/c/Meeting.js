import io from 'socket.io-client';
export default class Meeting{
    constructor(peerName){
        let peerId=null;
        let peerList=null;
        let socket=null;
        console.log("Meeting Object constructor is called.")
        this.connect=()=>{
            socket= io(process.env.REACT_APP_SOCKET_URL + "c", {
                transports: ["websocket"],
            });
            socket.on("askConnect",peer=>{
                console.log("Receive Hi Event from "+JSON.stringify(peer)+".");
            });
            socket.on("askReconnect",peerName=>{
                console.log("Receive askReconnect Event from "+peerName+".");
            });
            socket.io.on("reconnect", () => {
                console.log("Reconnect successed.");
                socket.emit("reconnectRequest",{ peerId: peerId, peerName: peerName });
            });
            socket.on("removeId",peerId=>{
                console.log("Receive remove id event ,peerId:"+peerId);
            });
            socket.emit("hi",peerName, response => {
                peerId=response.peerId;
                peerList=response.peerList;
                console.log("==================Receive Hi Response Start===============");
                console.log("peerId:"+peerId);
                console.log("==================peer list===============");
                console.log(peerList);
                console.log("==================Receive Hi Response End===============");
            });            
        }
        this.disconnect=()=>{
            if (socket){
                socket.disconnect();
            }            
        }
    }
}