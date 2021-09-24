import io from 'socket.io-client';
class WebRTC{
    constructor(){
        var configuration = {iceServers: 
            [{urls: "stun:stun.stunprotocol.org"},
             {urls: "stun:stun.l.google.com:19302"},
             {urls: "turn:numb.viagenie.ca", credential: "turnserver", username: "sj0016092@gmail.com"}		
            ]};
        var connectionCloseHandler;
        var dataChannel;
        var dataChannelOpenHandler;
        var isConnected=false,iceCandidateList=[];
        var ignoreOffer = false,isHangUpByUser=false;
        var peerConnection=null, makingOffer = false;
        var msgLogger,myRollDiceResult;
        var polite=false,resetRemoteStreamHandler;
        var socket=io.connect("http://localhost:9000");
        var trackEventHandler;
/*========================================================================================================*/				
/*        public method                                                                                  */ 
/*========================================================================================================*/	
        this.call=async()=>{
            call();
        }
        this.hangUp=()=>{
            hangUp();
        }
        this.init=()=>{
            initObject();
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
        this.setResetRemoteStreamHandler=(handler)=>{
            resetRemoteStreamHandler=handler;
        }
        this.setTrackEventHandler=(handler)=>{
            trackEventHandler=handler;
        }
        this.updateStream=(stream)=>{
            if (peerConnection){
                var senders=peerConnection.getSenders();
                senders.forEach((sender)=>{
                    if (sender.track)
                        sender.track.stop();
                });
                if (stream){
                    if (senders.length<1){
                        stream.getTracks().forEach((track)=>{
                            msgLogger("0 add "+track.kind+" track");
                            peerConnection.addTrack(track,stream);
                        });
                    } else {
                        stream.getTracks().forEach((track)=>{
                            var sender = peerConnection.getSenders().find(function(s) {
                                if (s.track)
                                    return s.track.kind === track.kind;
                                else 
                                    return null;
                            });
                            if (sender===undefined) {
                                msgLogger("1 add "+track.kind+" track");
                                peerConnection.addTrack(track,stream);
                            } else {
                                msgLogger("Replace "+track.kind+" track");
                                sender.replaceTrack(track,stream);
                            }                        
                        });
                        msgLogger("isConnected="+isConnected);
                        if (isConnected){
                            this.call();
                        }
                    }
                }
            }
        }
/*========================================================================================================*/				
/*        private method                                                                                  */ 
/*========================================================================================================*/	        
        
        function call(){
            myRollDiceResult=getRandomNum();
			socket.emit("requestRollDice",myRollDiceResult);
        }
        function getRandomNum(){
			return (Math.round(Math.random() * 1000));
        }
        function hangUp(){
            if (isConnected){
                isHangUpByUser=true;
                socket.emit("hangUp");
            }
        }
        function setPolite(peerRollDiceResult) {
            msgLogger("Set Polite");
			if (myRollDiceResult===peerRollDiceResult) {
				msgLogger("Because myRollDiceResult=peerRollDiceResult execute Call function again");
				call();
			} else{
				if (myRollDiceResult>peerRollDiceResult) {
					polite=false;
				} else {
					polite=true;
				}
                msgLogger("myRollDiceResult="+myRollDiceResult+",peerRollDiceResult="+peerRollDiceResult+",polite="+polite);
                initObject();
			}				
		}		
//=============================================================================================================        
        function dataChannelClose(event){
            msgLogger(`Connection close is request by user=${isHangUpByUser}`);
            if (isHangUpByUser){
                msgLogger('Data channel closed');
                dataChannel.onopen = null;
                dataChannel.onmessage = null;
                dataChannel.onclose = null;
                dataChannel.onerror = null;
                dataChannel=null;

                peerConnection.ontrack= null;
                peerConnection.onconnectionstatechange = null;
                peerConnection.ondatachannel = null;           
                peerConnection.onicecandidate= null;
                peerConnection.oniceconnectionstatechange= null;
                peerConnection.onicegatheringstatechange= null;
                peerConnection.onnegotiationneeded= null;
                peerConnection.onsignalingstatechange= null;

                peerConnection= null;
                isHangUpByUser=false;
                socket.disconnect();
                connectionCloseHandler();
                isConnected=false;
            } else {
                call();
            }
        }
        function dataChannelError(event){
            msgLogger('Data channel error:'+event.message);
        }
        function dataChannelEventHandler(event){
            msgLogger('Data channel is created!');
			event.channel.onopen = dataChannelOpen;
			event.channel.onmessage = dataChannelMessage;
			event.channel.onclose =  dataChannelClose;
			event.channel.onerror = dataChannelError;
        }
        function dataChannelMessage(message){
            msgLogger('Received Message from Data Channel:'+message.data);
        }
        function dataChannelOpen(event){
            isConnected=true;
            dataChannelOpenHandler();
        }
//=============================================================================================================
        async function addAllICECandidate(){
            for (var i=0;i<iceCandidateList.length;i++){
                await peerConnection.addIceCandidate(iceCandidateList[i]);
            }
            iceCandidateList=[];
        }
        /**
		* The connectionStateChange event work on chrome only;
		* firefox does not support RTCPeerConnection.connectionState attribute 
		**/
        function connectionStateChangeHandler(event){
            msgLogger("Connection State Change");
            msgLogger("peerConnection.connectionState="+peerConnection.connectionState+",isHangUpByUser="+isHangUpByUser);
        }
        function iceCandidateEventHandler(event){
            if (event.candidate==null){
				msgLogger("All ICE Candidates are sent");
			} else {
				msgLogger("Send an ICE Candidate");
				socket.emit("sendICECandidate",event.candidate);
			}
        }
        function iceConnectionStateChangeHandler(event){
            msgLogger("ICE Connection State Changed to:"+peerConnection.iceConnectionState)
        }
        function iceGatheringStateChangeHandler(event){
            msgLogger("ICE Gathering State Changed to:"+peerConnection.iceGatheringState)
        }
        async function negotiationEventHandler(event){
            msgLogger('Handle Negotiation');
            try {
				makingOffer = true;
				await peerConnection.setLocalDescription();
				
				if (peerConnection.localDescription){
					msgLogger("0:ignoreOffer="+ignoreOffer+"<br>makingOffer="+makingOffer+"<br>peerConnection.iceConnectionState="+peerConnection.iceConnectionState+",peerConnection.signalingState="+peerConnection.signalingState+",polite="+polite);
					socket.emit("sendSDP",peerConnection.localDescription);
				}
			} catch(err) {
				msgLogger(err);
			} finally {
				makingOffer = false;
			}
        }
        function signalingStateChangeHandler(event){
            switch (peerConnection.signalingState){
				case "stable":
					msgLogger("ICE negotiation complete");
                    break;
                default:
                    msgLogger("Signaling State change to"+peerConnection.signalingState);    
			}
        }
        function initObject(){
            peerConnection=new RTCPeerConnection(configuration);
            peerConnection.ontrack=trackEventHandler;
            peerConnection.onconnectionstatechange = connectionStateChangeHandler;
            peerConnection.ondatachannel = dataChannelEventHandler;
            peerConnection.onicecandidate=iceCandidateEventHandler;
            peerConnection.oniceconnectionstatechange = iceConnectionStateChangeHandler;
            peerConnection.onicegatheringstatechange =iceGatheringStateChangeHandler;
            peerConnection.onnegotiationneeded=negotiationEventHandler;
            peerConnection.onsignalingstatechange=signalingStateChangeHandler;
            
            dataChannel= peerConnection.createDataChannel('chat');
            msgLogger("Connection object created");
        }


/*===================================================================================================*/
/*       Socket related function                                                                     */
/*===================================================================================================*/
        socket.on("hangUp",()=>{
            isHangUpByUser=true;
            peerConnection.close();
        })
        socket.on("receiveICECandidate",async (iceCandidate)=>{
            try {
                msgLogger("Received an ICE Candidate:"+(peerConnection.currentRemoteDescription==null))
                if (peerConnection.currentRemoteDescription){
                    await peerConnection.addIceCandidate(iceCandidate);
                    addAllICECandidate();
                } else {
                    iceCandidateList.push(iceCandidate);
                }
            } catch(err) {
                if (!ignoreOffer) {
                throw err;
                }
            }
        });
        socket.on("requestRollDice",(peerRollDiceResult=>{
            msgLogger("receive roll Dice");
            myRollDiceResult=getRandomNum();
            socket.emit("sendRollDiceResult",myRollDiceResult);
            setPolite(peerRollDiceResult);
        }));
        socket.on("receiveRollDiceResult",(peerRollDiceResult)=>{
            msgLogger("receiveRollDiceResult");
            setPolite(peerRollDiceResult);
        });
        socket.on("receiveSDP",async (sdp)=>{
            msgLogger("receive SDP");
            ignoreOffer = false;
            const offerCollision = (sdp.type === "offer") &&
                             (makingOffer || peerConnection.signalingState !== "stable");
            

            ignoreOffer = !polite && offerCollision;
            if (peerConnection){
                msgLogger("1:ignoreOffer="+ignoreOffer+",makingOffer="+makingOffer+",offerCollision="+offerCollision+"<br>peerConnection.iceConnectionState="+peerConnection.iceConnectionState+",peerConnection.signalingState="+peerConnection.signalingState+",polite="+polite+",sdp.type="+sdp.type);
            }else{ 
                msgLogger("peerConnection=null");
            }
            if (ignoreOffer) {
                return;
            }
            try{
                await peerConnection.setRemoteDescription(sdp);
                addAllICECandidate();
            }catch (error){
                msgLogger("Failed to setRemoteDescription :"+error+","+JSON.stringify(sdp));
            }
            if (sdp.type ==="offer") {
                try{
                    await peerConnection.setLocalDescription();
                    socket.emit("sendSDP",peerConnection.localDescription);
                    msgLogger("1 sendSDP "+(peerConnection.localDescription==null));
                }catch(error){
                    msgLogger("Failed to setLocalDescription :"+error);
                }
            }
        });
    }
}
export default WebRTC;           