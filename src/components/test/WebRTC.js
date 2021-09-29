import io from 'socket.io-client';
class WebRTC{
    constructor(peerName){
        let configuration = {
            iceServers:
                [{ urls: "stun:stun.stunprotocol.org" },
                { urls: "stun:stun.l.google.com:19302" },
                { urls: "turn:numb.viagenie.ca", credential: "turnserver", username: "sj0016092@gmail.com" }
                ]
        };
        let dataChannel=null,ignoreOffer=false;
        let makingOffer = false,msgLogger;
        let peerConnection=null,polite=false;
        let socket=io.connect(process.env.REACT_APP_SOCKET_URL+"test", { transports: ['websocket'] });
        socket.on("requestConnect",(remotePeerName)=>{
            console.log(peerName+' received request connect event from '+remotePeerName);
            if (peerConnection === null){
                init();
            }
        });
        this.call=()=>{
            polite=true;
            socket.emit("askConnect",peerName);
            init();
            dataChannel= peerConnection.createDataChannel('chat');
            dataChannel.onopen = dataChannelOpen;
            dataChannel.onmessage = dataChannelMessage;
            dataChannel.onclose =  dataChannelClose;
            dataChannel.onerror = dataChannelError;
        }
        this.hangUp=()=>{
            //socket.emit("hangUp");
            hangUp();
        }
        this.setMsgLogger=(logger)=>{
            msgLogger=logger;
        }
//=================================================================================================
        function dataChannelEventHandler(event){
            msgLogger(peerName+' Data channel is created!');
            event.channel.onopen = dataChannelOpen;
            event.channel.onmessage = dataChannelMessage;
            event.channel.onclose =  dataChannelClose;
            event.channel.onerror = dataChannelError;
            dataChannel=event.channel;
        }
        function dataChannelClose(event){
            msgLogger(peerName+" Data Connection close");
            /* 
            event.target.onopen = null;
            event.target.onmessage = null;
            event.target.onclose = null;
            event.target.onerror = null;
            
            dataChannel=null;
            peerConnection=null;            
            */
        }
        function dataChannelError(event){
            msgLogger(peerName+' Data channel error:'+event.error.message);
        }
        function dataChannelMessage(message){
            msgLogger(peerName+' Received Message from Data Channel:'+message.data);
        }
        function dataChannelOpen(event){
            msgLogger(peerName+' Data Channel Open');
        }
//=======================================================================================================
        async function handleNegotiation() {
            try {
                msgLogger(peerName+' Handle Negotiation');
                makingOffer = true;
                await peerConnection.setLocalDescription();
                socket.emit('sendLocalDescription',peerConnection.localDescription);
            } catch (err) {
                console.error(err);
                msgLogger(err)
            } finally {
                makingOffer = false;
            }
        }
        function hangUp(){
            /*
            dataChannel.close();
            dataChannel=null;
            

            peerConnection.onicecandidate = null;
            peerConnection.onnegotiationneeded = null;
            peerConnection.oniceconnectionstatechange = null;
            peerConnection.onsignalingstatechange=null;
            */

            peerConnection.close();
            //peerConnection=null;
        }
        function iceCandidateEventHandler(event) {
            if (event.candidate == null) {
                msgLogger(peerName+" All ICE candidates are sent");
            } else {
                msgLogger(peerName+" An ICE candidate is sent.");
                socket.emit("sendICECandidate",event.candidate);
            }
        }
        function iceConnectionStateChangeHandler(event){
            msgLogger(peerName+" ICE Connection State Changed to:"+peerConnection.iceConnectionState);
            if (peerConnection.iceConnectionState === "failed") {
                peerConnection.restartIce();
            }
        }
        async function init(){
            peerConnection = new RTCPeerConnection(configuration);
            peerConnection.ondatachannel = dataChannelEventHandler;
            peerConnection.onicecandidate = iceCandidateEventHandler;
            peerConnection.onnegotiationneeded = handleNegotiation;
            peerConnection.oniceconnectionstatechange = iceConnectionStateChangeHandler;
            peerConnection.onsignalingstatechange=signalingStateChangeHandler;
            socket.on("hangUp",async()=>{
                msgLogger(peerName+" receive hang up event.")
                hangUp();
            });
            socket.on("receiveICECandidate",async (iceCandidate)=>{
                msgLogger(peerName+" receiveICECandidate");
                await peerConnection.addIceCandidate(iceCandidate);
            });
            socket.on("receiveRemoteDescription",async(remoteDescription)=>{
                msgLogger(peerName+" receive remote description");
                const offerCollision = (remoteDescription.type === "offer") &&
                             (makingOffer || peerConnection.signalingState !== "stable");

                ignoreOffer = !polite && offerCollision;
                if (ignoreOffer) {
                    return;
                }
                await peerConnection.setRemoteDescription(remoteDescription);
                if (remoteDescription.type === "offer") {
                    await peerConnection.setLocalDescription();
                    socket.emit('sendLocalDescription',peerConnection.localDescription);
                }
            })
            msgLogger(peerName+" init()");
        }
        function signalingStateChangeHandler(event){
            msgLogger(peerName+" Signaling State change to "+peerConnection.signalingState);   
        }
//=======================================================================================================
    }
}
export default WebRTC;