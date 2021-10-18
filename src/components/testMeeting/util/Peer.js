import WebRTC from "./WebRTC";
export default class Peer{
    constructor(peerName,remoteSocketId){
        let closeEventHandler=[], connectedEventHandler=[];
        let dataEventHandler=[],signalEventHandler=[],streamEventHandler=[];
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
            webRTC.on("close",()=>{
                msgLogger("Connection to "+peerName+" is closed.");
                closeEventHandler.forEach(handler=>{
                    handler();
                })
            });
            webRTC.on("connect",()=>{
                msgLogger("Connection to "+peerName+" is established.");
                connectedEventHandler.forEach(handler=>{
                    handler();
                })
            })
            webRTC.on('signal',data=>{
                msgLogger("Emit signal event to "+peerName+".");
                signalEventHandler.forEach(handler=>{
                    handler({to:this.socketId,signalData:data});
                });               
            });
            webRTC.on("data",(data)=>{
                msgLogger("Receive stream event from "+peerName+".");
                dataEventHandler.forEach(handler=>{
                    handler({"data":data,peer:this});
                });
            });
            webRTC.on("stream",(stream)=>{
                msgLogger("Receive stream event from "+peerName+".");
                streamEventHandler.forEach(handler=>{
                    handler({peer:this,"stream":stream});
                })
            });
            webRTC.init();
        }
        this.on=(eventType,handler)=>{
            switch (eventType){
                case "data":
                    dataEventHandler.push(handler);
                    break;
                case "signal":    
                    signalEventHandler.push(handler);
                    break;
                case "stream":
                    streamEventHandler.push(handler);
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
