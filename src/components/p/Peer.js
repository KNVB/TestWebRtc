import WebRTC from "./WebRTC";
export default class Peer{
    constructor(peerName,socketId){
        let webRTC=new WebRTC(peerName);
        this.name=peerName;
        this.on=(eventType,handler)=>{
            switch (eventType){
                
            }
        }
    }
}
