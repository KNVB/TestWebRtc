import WebRTC from './WebRTC';
class Peer {
    constructor(peerName) {
        let msgLogger;
        let webRTC=new WebRTC({dataChannelEventHandler,iceStateHandler,peerName});
        this.call=()=>{
            //console.log(msglogger);
            webRTC.call();            
        }
        this.setMsgLogger=(logger)=>{
            msgLogger=logger;
        }
        function dataChannelError(event){
            console.log(peerName+' Data channel error:'+event.message);
        }
        function dataChannelClose(event){
            console.log(peerName+" Connection close");
        }
        function dataChannelEventHandler(event){
            console.log(peerName+' Data channel is created!');
            event.channel.onopen = dataChannelOpen;
			event.channel.onmessage = dataChannelMessage;
			event.channel.onclose =  dataChannelClose;
			event.channel.onerror = dataChannelError;
        }
        function dataChannelMessage(message){
            console.log(peerName+' Received Message from Data Channel:'+message.data);
        }
        function dataChannelOpen(event){
            console.log(peerName+" Data Channel Opened.");
        }
        function iceStateHandler(status){
            console.log(peerName+" ICE Connection State Changed to:"+status);
        }
    }
}
export default Peer;    