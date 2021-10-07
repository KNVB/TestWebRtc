import WebRTC from './WebRTC';
export default class Peer{
    constructor(){
        this.name="";
        this.remoteSocketId=null;
        this.socket=null;        
        let webRTC=new WebRTC();
        this.askConnect=()=>{
            this.socket.emit("askConnect",{from:this.socket.id,to:this.remoteSocketId})
        }
    }   
    
} 