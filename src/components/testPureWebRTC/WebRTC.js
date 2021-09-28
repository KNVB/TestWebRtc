import io from 'socket.io-client';
class WebRTC {
    constructor(peerName) {
        let configuration = {
            iceServers:
                [{ urls: "stun:stun.stunprotocol.org" },
                { urls: "stun:stun.l.google.com:19302" },
                { urls: "turn:numb.viagenie.ca", credential: "turnserver", username: "sj0016092@gmail.com" }
                ]
        };
        let connectionCloseHandler;
        let dataChannel,dataChannelOpenHandler;
        let isDataChannelOk=false,ignoreOffer = false;
        let makingOffer = false, msgLogger
        let peerConnection = null, polite = false;;
        let socket;
        this.call =() => {
            polite = true;
            //console.log(peerName+".peerConnection="+peerConnection);
            if (peerConnection === null){
                this.init();
            }            
            dataChannel= peerConnection.createDataChannel('chat');
            /*
            dataChannel.onopen = dataChannelOpen;
            dataChannel.onmessage = dataChannelMessage;
            dataChannel.onclose =  dataChannelClose;
            dataChannel.onerror = dataChannelError;
            */
        }
        this.hangUp=()=>{
            peerConnection.close();
            peerConnection=null;
        }
        this.init=()=>{
            init();
        }
        this.setConnectionCloseHandler=(handler)=>{
            connectionCloseHandler=handler;
        }
        this.setDataChannelOpenHandler=(handler)=>{
            dataChannelOpenHandler=handler;
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
            event.target.onopen = null;
            event.target.onmessage = null;
            event.target.onclose = null;
            event.target.onerror = null;            
        }
        function dataChannelError(event){
            msgLogger(peerName+' Data channel error:'+event.error.message);
        }
        function dataChannelMessage(message){
            msgLogger(peerName+' Received Message from Data Channel:'+message.data);
        }
        function dataChannelOpen(event){
            isDataChannelOk=true;
            //dataChannelOpenHandler(event);
        }
//================================================================================================                
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
        function iceCandidateEventHandler(event) {
            if (event.candidate == null) {
                msgLogger(peerName+" All ICE candidates are sent");
            } else {
                msgLogger(peerName+" An ICE candidate is recieved.");
                socket.emit("sendICECandidate",event.candidate);
            }
        }
        function iceConnectionStateChangeHandler(event){
            msgLogger(peerName+" ICE Connection State Changed to:"+peerConnection.iceConnectionState);
            if (peerConnection.iceConnectionState === "failed") {
                peerConnection.restartIce();
            }
        }
        function init(){
            peerConnection = new RTCPeerConnection(configuration);
            peerConnection.ondatachannel = dataChannelEventHandler;
            peerConnection.onicecandidate = iceCandidateEventHandler;
            peerConnection.onnegotiationneeded = handleNegotiation;
            peerConnection.oniceconnectionstatechange = iceConnectionStateChangeHandler;
            peerConnection.onsignalingstatechange=signalingStateChangeHandler;
            socket = io.connect(process.env.REACT_APP_SOCKET_HOST+":" + process.env.REACT_APP_SOCKET_PORT+"/testPureWebRTC", { transports: ['websocket'] });
           
            socket.on("receiveRemoteDescription",async (remoteDescription)=>{
                msgLogger(peerName+" received remote description");
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
            });
            socket.on("receiveICECandidate",async(iceCandidate)=>{
                await peerConnection.addIceCandidate(iceCandidate);
            });
        }
        function signalingStateChangeHandler(event){
            msgLogger(peerName+" Signaling State change to "+peerConnection.signalingState);   
        }
    }
}
export default WebRTC;