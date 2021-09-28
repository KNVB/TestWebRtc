import io from 'socket.io-client';
class WebRTC {
    constructor({dataChannelEventHandler,iceStateHandler,peerName}) {
        let configuration = {
            iceServers:
                [{ urls: "stun:stun.stunprotocol.org" },
                { urls: "stun:stun.l.google.com:19302" },
                { urls: "turn:numb.viagenie.ca", credential: "turnserver", username: "sj0016092@gmail.com" }
                ]
        };
        let dataChannel=null;
        let makingOffer=false,ignoreOffer=false;
        let polite=false;
        let peerConnection=new RTCPeerConnection(configuration);
        peerConnection.ondatachannel = dataChannelEventHandler;
        peerConnection.onicecandidate=iceCandidateEventHandler;
        peerConnection.oniceconnectionstatechange =()=>{ 
            if (peerConnection.iceConnectionState === "failed") {
                peerConnection.restartIce();
              }
            iceStateHandler(peerConnection.iceConnectionState)};
        peerConnection.onnegotiationneeded=negotiationEventHandler;
        let socket = io.connect(process.env.REACT_APP_SOCKET_HOST+":" + process.env.REACT_APP_SOCKET_PORT+"/testPureWebRTC", { transports: ['websocket'] }); 
        socket.on("receiveICECandidate",iceCandidate=>{
            console.log(peerName+" receive ICECandidate");
            peerConnection.addIceCandidate(iceCandidate);
        });
        socket.on("receiveRemoteDescription",async(remoteDescription)=>{
            console.log(peerName+" receive remote description");           
            try{
                const offerCollision = (remoteDescription.type === "offer") &&
                                (makingOffer || peerConnection.signalingState !== "stable");
                ignoreOffer = !polite && offerCollision;
                if (ignoreOffer) {
                    return;
                }
                await peerConnection.setRemoteDescription(remoteDescription);
                if (remoteDescription.type === "offer") {
                    await peerConnection.setLocalDescription();
                    socket.emit('sendLocalDescription', peerConnection.localDescription);
                }
            }catch(err) {
                console.log("Receive Remote Description Error:"+err.message);
                //console.log(err);
            }
        });
        this.call=()=>{
            polite=true;
            dataChannel= peerConnection.createDataChannel('chat');
        }
//===============================================================================================
        function iceCandidateEventHandler(event){
            if (event.candidate==null){
                console.log(peerName+" All ICE Candidates are sent");
            } else {
                console.log(peerName+" send an ICE Candidate");
                socket.emit("sendICECandidate",event.candidate);
            }
        }
        async function negotiationEventHandler(event){
            console.log(peerName+" Negotiation event Received.");
            try {
                makingOffer = true;
                await peerConnection.setLocalDescription();
                //socket.emit('sendLocalDescription', peerConnection.localDescription);
            } catch(err) {
                console.error(err);
            } finally {
                makingOffer = false;
              }
        }
    }
}
export default WebRTC;