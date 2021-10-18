import WebRTC from "./WebRTC";
export default class Peer{
    constructor(peerName,remoteSocketId,socket){
        let handleDataEvent, handleStreamEvent;
        this.socketId=remoteSocketId;
        let webRTC=new WebRTC(peerName);
        //webRTC.setDebug(true);
        this.name=peerName;
        this.call=()=>{
            msgLogger("Make Call to "+peerName);
            webRTC.call();
        }
        this.hangUp=()=>{
            webRTC.hangUp();
        }
        this.init=()=>{
            webRTC.on("connect",()=>{
                msgLogger("Connection to "+peerName+" is established.");
            })
            webRTC.on('signal',data=>{
                msgLogger(peerName+" send signal event.");
                socket.emit("signalData",{to:this.socketId,signalData:data});
            });
            webRTC.on("data",(data)=>{
                if (handleDataEvent){
                    handleDataEvent(data,this);
                }
            });
            webRTC.on("stream",(stream)=>{
                msgLogger(peerName+" receive stream event.");
                if (handleStreamEvent) {
                    handleStreamEvent({stream:stream,peer:this});
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
                default:
                    break;    
            }
        }
        this.setStream=(stream)=>{
            webRTC.setStream(stream);
        }
        this.signal=(signalData)=>{
            webRTC.signal(signalData);
        }
//========================================================================================        
        let msgLogger=(msg)=>{
            console.log(msg);
        }
    }
}
