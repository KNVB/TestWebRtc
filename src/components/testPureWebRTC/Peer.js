import io from 'socket.io-client';
class Peer {
    constructor(peerName) {
        let msglogger;
        let configuration = {
            iceServers:
                [{ urls: "stun:stun.stunprotocol.org" },
                { urls: "stun:stun.l.google.com:19302" },
                { urls: "turn:numb.viagenie.ca", credential: "turnserver", username: "sj0016092@gmail.com" }
                ]
        };
        let dataChannel;
        let ignoreOffer = false,makingOffer=false;
        let peerConnection,polite=false;
        let socket = io.connect(process.env.REACT_APP_SOCKET_HOST+":" + process.env.REACT_APP_SOCKET_PORT+"/testPureWebRTC", { transports: ['websocket'] });
        socket.on("receiveRemoteDescription",async(remoteDescription)=>{
            try{
                const offerCollision = (remoteDescription.type == "offer") &&
                                (makingOffer || peerConnection.signalingState != "stable");
                ignoreOffer = !polite && offerCollision;
                if (ignoreOffer) {
                    return;
                }
                await peerConnection.setRemoteDescription(remoteDescription);
                if (remoteDescription.type == "offer") {
                    await peerConnection.setLocalDescription();
                    socket.emit('sendLocalDescription', peerConnection.localDescription);
                }
            }catch(err) {
                console.log(err);
            }
        });
        this.call=()=>{
            //console.log(msglogger);
            polite=true;
            peerConnection=new RTCPeerConnection(configuration);
            peerConnection.onicecandidate=(event)=>{iceCandidateEventHandler(event,msglogger);}
            peerConnection.onnegotiationneeded=negotiationEventHandler; 
            dataChannel= peerConnection.createDataChannel('chat');
        }
        this.setMsgLogger=(logger)=>{
            msglogger=logger;
        }
//=======================================================================================================
        function iceCandidateEventHandler(event,msglogger){
            if (event.candidate==null){
                msglogger.log("All ICE Candidates are sent");
            } else {
                console.log("Send an ICE Candidate");
                socket.emit("sendICECandidate",event.candidate);
            }
        }
        async function negotiationEventHandler(event){
            try {
                makingOffer = true;
                await peerConnection.setLocalDescription();
                socket.emit('sendLocalDescription', peerConnection.localDescription);
              } catch(err) {
                console.error(err);
              } finally {
                makingOffer = false;
              }
        }
    }
}
export default Peer;    