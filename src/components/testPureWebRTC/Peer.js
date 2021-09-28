import WebRTC from './WebRTC';
class Peer {
    constructor(peerName) {
        let mslogger;
        let webRTC=new WebRTC(peerName);
        this.call=()=>{
            //console.log("log="+(mslogger==null));
            webRTC.call(true);            
        }
        this.hangUp=()=>{
            webRTC.hangUp();
            webRTC=null;
            webRTC=new WebRTC(peerName);
            webRTC.init();
        }
        this.init=()=>{
            webRTC.init();
        }
        this.setDataChannelOpenHandler=(dataChannelOpenHandler)=>{
            webRTC.setDataChannelOpenHandler(dataChannelOpenHandler);
        }
        this.setMsgLogger=(logger)=>{
            mslogger=logger;
            webRTC.setMsgLogger(logger);
        }
    }
}
export default Peer;    