import WebRTC from "./WebRTC";
export default class Peer{
    constructor(peerName,remoteSocketId,socket){
        let handleDataEvent, handleStreamEvent;
        let socketId=remoteSocketId;
        let webRTC=new WebRTC(peerName);
        this.name=peerName;
        this.init=()=>{
            webRTC.on("connect",()=>{
                msgLogger("Connection to "+peerName+" is established.");
            })
            webRTC.on('signal',data=>{
                //console.log(peerName+" send signal event.");
                socket.emit("signalData",{to:socketId,signalData:data});
            });
            webRTC.on("data",(data)=>{
                if (handleDataEvent){
                    handleDataEvent(data,socket.id);
                }
            });
            webRTC.on("stream",(stream)=>{
                if (handleStreamEvent) {
                    handleStreamEvent(stream,socket.id);
                }
            });
            webRTC.init();
        }
        this.on=(eventType,handler)=>{
            switch (eventType){
                case "data":
                    handleDataEvent=handler;
                    break;
                case "stream":
                    handleStreamEvent=handler;
                    break;
            }
        }
        let msgLogger=(msg)=>{
            console.log(msg);
        }
    }
}
