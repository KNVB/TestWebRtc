import io from 'socket.io-client';
class WebRTC{
    constructor(){
        var configuration = {iceServers: 
            [{urls: "stun:stun.stunprotocol.org"},
             {urls: "stun:stun.l.google.com:19302"},
             {urls: "turn:numb.viagenie.ca", credential: "turnserver", username: "sj0016092@gmail.com"}		
            ]};
        var isHangUpByUser=false,eventMsgLogger=null;
        var peerConnection=null;    
        var socket=io.connect("http://localhost:9000");

        this.init=()=>{
            initObject();
        }
        this.setMsgLogger=logger=>{
            eventMsgLogger=logger;
        }
/*========================================================================================================*/				
/*        private method                                                                                  */ 
/*========================================================================================================*/			
        function initObject(){
            peerConnection=new RTCPeerConnection(configuration);
            peerConnection.onconnectionstatechange = connectionStateChangeHandler;
            peerConnection.ondatachannel = dataEventMsgLogger;
            peerConnection.onicecandidate=iceCandidateEventHandler;
            peerConnection.oniceconnectionstatechange = iceConnectionStateChangeHandler;
            peerConnection.onicegatheringstatechange =iceGatheringStateChangeHandler;
            peerConnection.onnegotiationneeded=negotiationEventHandler;
            peerConnection.onsignalingstatechange=signalingStateChangeHandler;
            peerConnection.ontrack=trackEventHandler;

            dataChannel= peerConnection.createDataChannel('chat');
            eventMsgLogger("Connection object created");
        }
    }
}
export default WebRTC;